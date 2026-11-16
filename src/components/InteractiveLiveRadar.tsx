import { useEffect, useRef, useState, useMemo } from "react";
import {
  MapPin,
  Phone,
  Droplet,
  Building2,
  Ambulance,
  Crosshair,
  Layers,
  Filter,
  ExternalLink,
  Loader2,
  Sparkles,
  Search,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type BloodGroup, BLOOD_GROUPS, toBnNum } from "@/lib/supabase";
import { HOSPITALS_DATA } from "@/lib/data/hospitals-data";
import { AMBULANCE_DATA } from "@/lib/data/ambulance-data";
import {
  MYMENSINGH_CENTER,
  MYMENSINGH_AREA_COORDS,
  SAMPLE_MAP_DONORS,
  calculateDistanceKm,
  type Coords,
} from "@/lib/area-coords";

export function InteractiveLiveRadar() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const radiusCircleRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersLayerRef = useRef<any>(null);

  const [isMapReady, setIsMapReady] = useState(false);
  const [centerCoords, setCenterCoords] = useState<Coords>(MYMENSINGH_CENTER);
  const [centerLabel, setCenterLabel] = useState<string>("ময়মনসিংহ মেডিকেল / চরপাড়া এলাকা");
  const [isLocating, setIsLocating] = useState(false);

  // Filters
  const [radiusKm, setRadiusKm] = useState<number>(5); // 2, 5, 10, 15, or 50 (All)
  const [showDonors, setShowDonors] = useState<boolean>(true);
  const [showHospitals, setShowHospitals] = useState<boolean>(true);
  const [showAmbulances, setShowAmbulances] = useState<boolean>(true);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("all");

  // Filter items by radius from centerCoords
  const nearbyDonors = useMemo(() => {
    if (!showDonors) return [];
    return SAMPLE_MAP_DONORS.filter((donor) => {
      if (selectedBloodGroup !== "all" && donor.blood_group !== selectedBloodGroup) {
        return false;
      }
      const dist = calculateDistanceKm(centerCoords, donor.coordinates);
      return dist <= radiusKm;
    });
  }, [centerCoords, radiusKm, showDonors, selectedBloodGroup]);

  const nearbyHospitals = useMemo(() => {
    if (!showHospitals) return [];
    return HOSPITALS_DATA.filter((hospital) => {
      const dist = calculateDistanceKm(centerCoords, hospital.coordinates);
      return dist <= radiusKm;
    });
  }, [centerCoords, radiusKm, showHospitals]);

  const nearbyAmbulances = useMemo(() => {
    if (!showAmbulances) return [];
    return AMBULANCE_DATA.map((ambulance) => {
      // Find coordinates for ambulance baseLocation
      const coords =
        MYMENSINGH_AREA_COORDS[ambulance.baseLocation] ||
        (ambulance.baseLocation.includes("চরপাড়া")
          ? MYMENSINGH_AREA_COORDS["চরপাড়া"]
          : ambulance.baseLocation.includes("চুরখাই")
            ? MYMENSINGH_AREA_COORDS["চুরখাই"]
            : ambulance.baseLocation.includes("গাঙ্গিনারপাড়")
              ? MYMENSINGH_AREA_COORDS["গাঙ্গিনারপাড়"]
              : MYMENSINGH_CENTER);
      return {
        ...ambulance,
        coordinates: coords,
        distance: calculateDistanceKm(centerCoords, coords),
      };
    }).filter((a) => a.distance <= radiusKm);
  }, [centerCoords, radiusKm, showAmbulances]);

  // Handle GPS location
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("আপনার ব্রাউজারে লোকেশন সার্ভিস সমর্থিত নয়।");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const newCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCenterCoords(newCoords);
        setCenterLabel("আপনার বর্তমান জিপিএস লোকেশন");
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([newCoords.lat, newCoords.lng], 14);
        }
      },
      () => {
        setIsLocating(false);
        alert("লোকেশন অনুমতি পাওয়া যায়নি। অনুগ্রহ করে ব্রাউজারের লোকেশন অনুমতি চালু করুন।");
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  };

  // Initialize Leaflet Map (client-only)
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      try {
        const L = (await import("leaflet")).default;
        // Inject Leaflet CSS dynamically if not present
        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link");
          link.id = "leaflet-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }

        if (!isMounted || !mapContainerRef.current) return;

        // Initialize Map
        const map = L.map(mapContainerRef.current, {
          center: [MYMENSINGH_CENTER.lat, MYMENSINGH_CENTER.lng],
          zoom: 13,
          zoomControl: true,
        });

        // Add OpenStreetMap Tile Layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        // Layer group for dynamic markers
        const markersGroup = L.layerGroup().addTo(map);
        markersLayerRef.current = markersGroup;
        mapInstanceRef.current = map;

        setIsMapReady(true);
      } catch (err) {
        console.error("Map initialization failed:", err);
      }
    }

    void initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Center, Circle & Markers when state changes
  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current || !markersLayerRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    import("leaflet").then(({ default: L }: { default: any }) => {
      const map = mapInstanceRef.current;
      const layer = markersLayerRef.current;
      layer.clearLayers();

      // 1. Draw Radar Radius Circle
      if (radiusCircleRef.current) {
        map.removeLayer(radiusCircleRef.current);
      }
      const circle = L.circle([centerCoords.lat, centerCoords.lng], {
        radius: radiusKm * 1000,
        color: "#e11d48",
        fillColor: "#e11d48",
        fillOpacity: 0.06,
        weight: 1.5,
        dashArray: "6, 8",
      }).addTo(map);
      radiusCircleRef.current = circle;

      // 2. Center / Patient Reference Pin
      const centerIcon = L.divIcon({
        className: "custom-center-pin",
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute inline-flex h-10 w-10 animate-ping rounded-full bg-primary opacity-60"></span>
            <div class="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-lg">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
      L.marker([centerCoords.lat, centerCoords.lng], { icon: centerIcon }).addTo(layer).bindPopup(`
          <div class="p-1 text-center font-sans">
            <span class="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">রেফারেন্স লোকেশন</span>
            <p class="mt-1 text-xs font-semibold text-gray-800">${centerLabel}</p>
            <p class="text-[10px] text-gray-500">রেডিয়াস: ${toBnNum(radiusKm)} কি.মি.</p>
          </div>
        `);

      // 3. Render Blood Donor Markers
      if (showDonors) {
        nearbyDonors.forEach((donor) => {
          const donorIcon = L.divIcon({
            className: "donor-marker-pin",
            html: `
              <div class="flex flex-col items-center cursor-pointer transition-transform hover:scale-110">
                <div class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-rose-600 to-red-700 text-white shadow-md font-bold text-xs">
                  ${donor.blood_group}
                </div>
                <div class="h-1.5 w-1.5 rounded-full bg-red-600 -mt-0.5 shadow-xs"></div>
              </div>
            `,
            iconSize: [32, 34],
            iconAnchor: [16, 34],
          });

          L.marker([donor.coordinates.lat, donor.coordinates.lng], { icon: donorIcon }).addTo(layer)
            .bindPopup(`
              <div class="p-2 font-sans text-left min-w-[190px]">
                <div class="flex items-center justify-between gap-2 border-b pb-1.5">
                  <span class="rounded-full bg-rose-100 text-rose-700 px-2 py-0.5 text-xs font-black">${donor.blood_group}</span>
                  <span class="text-[10px] text-emerald-600 font-semibold">● প্রস্তুত ডোনার</span>
                </div>
                <h4 class="mt-2 text-sm font-bold text-gray-900">${donor.name}</h4>
                <p class="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                  <span>📍 ${donor.area}</span>
                  <span>(${toBnNum(calculateDistanceKm(centerCoords, donor.coordinates))} কি.মি.)</span>
                </p>
                <div class="mt-3 flex gap-2">
                  <a href="tel:${donor.phone}" class="flex-1 text-center bg-rose-600 hover:bg-rose-700 text-white rounded-lg py-1 px-2 text-xs font-bold no-underline">
                    📞 কল করুন
                  </a>
                  <a href="https://wa.me/${donor.phone.replace(/[^0-9]/g, "")}" target="_blank" class="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-1 px-2 text-xs font-bold no-underline">
                    WhatsApp
                  </a>
                </div>
              </div>
            `);
        });
      }

      // 4. Render Hospital & Blood Bank Markers
      if (showHospitals) {
        nearbyHospitals.forEach((hosp) => {
          const hospIcon = L.divIcon({
            className: "hospital-marker-pin",
            html: `
              <div class="flex flex-col items-center cursor-pointer transition-transform hover:scale-110">
                <div class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-md font-bold">
                  🏥
                </div>
                <div class="h-1.5 w-1.5 rounded-full bg-blue-600 -mt-0.5 shadow-xs"></div>
              </div>
            `,
            iconSize: [32, 34],
            iconAnchor: [16, 34],
          });

          L.marker([hosp.coordinates.lat, hosp.coordinates.lng], { icon: hospIcon }).addTo(layer)
            .bindPopup(`
              <div class="p-2 font-sans text-left min-w-[210px]">
                <div class="flex items-center justify-between border-b pb-1.5">
                  <span class="text-[11px] font-bold text-blue-700">${hosp.bloodBankAvailable ? "🩸 ব্লাড ব্যাংক সংরক্ষিত" : "🏥 হাসপাতাল"}</span>
                  <span class="text-[10px] text-gray-500">${toBnNum(calculateDistanceKm(centerCoords, hosp.coordinates))} কি.মি.</span>
                </div>
                <h4 class="mt-1.5 text-xs font-bold text-gray-900 leading-tight">${hosp.nameBn}</h4>
                <p class="text-[11px] text-gray-600 mt-0.5">📍 ${hosp.address}</p>
                <div class="mt-2.5 flex gap-2">
                  <a href="tel:${hosp.emergencyHotline}" class="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-1 px-2 text-xs font-bold no-underline">
                    📞 হটলাইন
                  </a>
                  ${hosp.mapUrl ? `<a href="${hosp.mapUrl}" target="_blank" class="border border-gray-300 text-gray-700 rounded-lg py-1 px-2 text-xs font-semibold no-underline">রুট</a>` : ""}
                </div>
              </div>
            `);
        });
      }

      // 5. Render Ambulance Stand Markers
      if (showAmbulances) {
        nearbyAmbulances.forEach((amb) => {
          const ambIcon = L.divIcon({
            className: "ambulance-marker-pin",
            html: `
              <div class="flex flex-col items-center cursor-pointer transition-transform hover:scale-110">
                <div class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-amber-500 text-white shadow-md font-bold text-xs">
                  🚑
                </div>
                <div class="h-1.5 w-1.5 rounded-full bg-amber-500 -mt-0.5 shadow-xs"></div>
              </div>
            `,
            iconSize: [32, 34],
            iconAnchor: [16, 34],
          });

          L.marker([amb.coordinates.lat, amb.coordinates.lng], { icon: ambIcon }).addTo(layer)
            .bindPopup(`
              <div class="p-2 font-sans text-left min-w-[200px]">
                <div class="flex items-center justify-between border-b pb-1.5">
                  <span class="text-[10px] font-bold text-amber-700">🚑 ${amb.vehicleType.toUpperCase()} অ্যাম্বুলেন্স</span>
                  <span class="text-[10px] text-gray-500">${toBnNum(amb.distance)} কি.মি.</span>
                </div>
                <h4 class="mt-1.5 text-xs font-bold text-gray-900 leading-tight">${amb.providerName}</h4>
                <p class="text-[11px] text-gray-600 mt-0.5">স্ট্যান্ড: ${amb.baseLocation}</p>
                <div class="mt-2.5">
                  <a href="tel:${amb.primaryPhone}" class="block text-center bg-amber-500 hover:bg-amber-600 text-white rounded-lg py-1 px-2 text-xs font-bold no-underline">
                    📞 সরাসরি কল (${amb.primaryPhone})
                  </a>
                </div>
              </div>
            `);
        });
      }
    });
  }, [
    isMapReady,
    centerCoords,
    centerLabel,
    radiusKm,
    showDonors,
    showHospitals,
    showAmbulances,
    nearbyDonors,
    nearbyHospitals,
    nearbyAmbulances,
  ]);

  return (
    <div className="space-y-6">
      {/* Control Panel Bar */}
      <Card className="border-border/80 bg-card p-4 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Location Reference Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span className="text-xs font-bold text-foreground">কেন্দ্রবিন্দু:</span>
            </div>

            <Select
              value={centerLabel}
              onValueChange={(label) => {
                setCenterLabel(label);
                const coords = MYMENSINGH_AREA_COORDS[label] || MYMENSINGH_CENTER;
                setCenterCoords(coords);
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.setView([coords.lat, coords.lng], 13);
                }
              }}
            >
              <SelectTrigger className="h-10 w-[180px] sm:w-[210px] rounded-xl border-border bg-background px-3 text-xs font-semibold text-foreground shadow-xs gap-2 [&>svg:last-child]:ml-auto">
                <SelectValue placeholder="এলাকা নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] border-border bg-popover/95 backdrop-blur-md shadow-xl rounded-xl">
                {Object.keys(MYMENSINGH_AREA_COORDS).map((area) => (
                  <SelectItem
                    key={area}
                    value={area}
                    className="cursor-pointer text-xs font-medium py-2 rounded-lg"
                  >
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLocateMe}
              disabled={isLocating}
              className="gap-1.5 text-xs cursor-pointer"
            >
              {isLocating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Crosshair className="h-3.5 w-3.5 text-primary" />
              )}
              <span>আমার জিপিএস লোকেশন</span>
            </Button>
          </div>

          {/* Center: Radius Filter Pills */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground shrink-0">দূরত্ব রেডার:</span>
            <div className="inline-flex rounded-xl border border-border bg-muted/40 p-1">
              {[2, 5, 10, 15].map((km) => (
                <button
                  key={km}
                  type="button"
                  onClick={() => setRadiusKm(km)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    radiusKm === km
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {toBnNum(km)} কি.মি.
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Layer Checkboxes & Blood Group Filter */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
          {/* Layer toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">লেয়ারসমূহ:</span>

            <button
              type="button"
              onClick={() => setShowDonors(!showDonors)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                showDonors
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-600"
                  : "border-border/60 bg-muted/30 text-muted-foreground opacity-60"
              }`}
            >
              <Droplet className="h-3.5 w-3.5 fill-rose-500/30" />
              <span>রক্তদাতা ({toBnNum(nearbyDonors.length)})</span>
            </button>

            <button
              type="button"
              onClick={() => setShowHospitals(!showHospitals)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                showHospitals
                  ? "border-blue-500/40 bg-blue-500/10 text-blue-600"
                  : "border-border/60 bg-muted/30 text-muted-foreground opacity-60"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>হাসপাতাল ({toBnNum(nearbyHospitals.length)})</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAmbulances(!showAmbulances)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                showAmbulances
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-600"
                  : "border-border/60 bg-muted/30 text-muted-foreground opacity-60"
              }`}
            >
              <Ambulance className="h-3.5 w-3.5" />
              <span>অ্যাম্বুলেন্স ({toBnNum(nearbyAmbulances.length)})</span>
            </button>
          </div>

          {/* Blood group quick filter */}
          {showDonors && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">গ্রুপ:</span>
              <Select
                value={selectedBloodGroup}
                onValueChange={(val) => setSelectedBloodGroup(val)}
              >
                <SelectTrigger className="h-8 w-[145px] rounded-xl border-border bg-background px-2.5 text-xs font-bold text-primary shadow-xs gap-1.5 [&>svg:last-child]:ml-auto">
                  <SelectValue placeholder="রক্তের গ্রুপ" />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover/95 backdrop-blur-md shadow-xl rounded-xl">
                  <SelectItem
                    value="all"
                    className="cursor-pointer text-xs font-semibold py-1.5 rounded-lg"
                  >
                    🩸 সকল গ্রুপ
                  </SelectItem>
                  {BLOOD_GROUPS.map((bg) => (
                    <SelectItem
                      key={bg}
                      value={bg}
                      className="cursor-pointer text-xs font-bold text-primary py-1.5 rounded-lg"
                    >
                      {bg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </Card>

      {/* Main Map & Live Radar Canvas */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl">
        {/* Radar Status Overlay Pill */}
        <div className="absolute top-4 left-4 z-[500] flex items-center gap-2 rounded-full border border-border/80 bg-background/90 px-3.5 py-1.5 text-xs font-medium text-foreground shadow-md backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>
            রেডারে সক্রিয়:{" "}
            <strong>
              {toBnNum(nearbyDonors.length + nearbyHospitals.length + nearbyAmbulances.length)}টি
            </strong>{" "}
            সেবা
          </span>
        </div>

        {/* Map Container */}
        <div ref={mapContainerRef} className="h-[520px] w-full bg-muted/20 md:h-[600px]" />

        {/* Loading state before client map mounts */}
        {!isMapReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xs">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
            <p className="mt-4 text-sm font-semibold text-foreground">
              ময়মনসিংহ লাইভ ম্যাপ রেডার লোড হচ্ছে...
            </p>
          </div>
        )}
      </div>

      {/* Nearby Quick List Cards Below Map */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Nearest Donors */}
        <Card className="p-4 border-border/80">
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <Droplet className="h-4 w-4 text-rose-600 fill-rose-600/30" />
              <h4 className="text-sm font-bold text-foreground">নিকটস্থ রক্তদাতা</h4>
            </div>
            <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-600">
              {toBnNum(nearbyDonors.length)} জন
            </span>
          </div>
          <div className="mt-3 divide-y divide-border/50 max-h-56 overflow-y-auto space-y-2">
            {nearbyDonors.slice(0, 5).map((d) => (
              <div key={d.id} className="pt-2 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground">{d.name}</span>
                    <span className="rounded bg-rose-500/10 text-rose-600 px-1.5 py-0.2 text-[10px] font-extrabold">
                      {d.blood_group}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">📍 {d.area}</span>
                </div>
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs text-rose-600 hover:text-rose-700"
                >
                  <a href={`tel:${d.phone}`}>কল</a>
                </Button>
              </div>
            ))}
            {nearbyDonors.length === 0 && (
              <p className="pt-3 text-xs text-muted-foreground text-center">
                নির্ধারিত দূরত্বের মধ্যে ডোনার পাওয়া যায়নি। রেডার বৃদ্ধি করুন।
              </p>
            )}
          </div>
        </Card>

        {/* Nearest Hospitals */}
        <Card className="p-4 border-border/80">
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              <h4 className="text-sm font-bold text-foreground">নিকটস্থ হাসপাতাল</h4>
            </div>
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
              {toBnNum(nearbyHospitals.length)}টি
            </span>
          </div>
          <div className="mt-3 divide-y divide-border/50 max-h-56 overflow-y-auto space-y-2">
            {nearbyHospitals.slice(0, 5).map((h) => (
              <div key={h.id} className="pt-2 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground block truncate max-w-[170px]">
                    {h.nameBn}
                  </span>
                  <span className="text-[11px] text-muted-foreground">📍 {h.area}</span>
                </div>
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700"
                >
                  <a href={`tel:${h.emergencyHotline}`}>কল</a>
                </Button>
              </div>
            ))}
            {nearbyHospitals.length === 0 && (
              <p className="pt-3 text-xs text-muted-foreground text-center">
                নির্ধারিত দূরত্বের মধ্যে হাসপাতাল পাওয়া যায়নি।
              </p>
            )}
          </div>
        </Card>

        {/* Nearest Ambulances */}
        <Card className="p-4 border-border/80">
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <Ambulance className="h-4 w-4 text-amber-600" />
              <h4 className="text-sm font-bold text-foreground">নিকটস্থ অ্যাম্বুলেন্স</h4>
            </div>
            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
              {toBnNum(nearbyAmbulances.length)}টি
            </span>
          </div>
          <div className="mt-3 divide-y divide-border/50 max-h-56 overflow-y-auto space-y-2">
            {nearbyAmbulances.slice(0, 5).map((a) => (
              <div key={a.id} className="pt-2 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground block truncate max-w-[170px]">
                    {a.providerName}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    স্ট্যান্ড: {a.baseLocation}
                  </span>
                </div>
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs text-amber-600 hover:text-amber-700"
                >
                  <a href={`tel:${a.primaryPhone}`}>কল</a>
                </Button>
              </div>
            ))}
            {nearbyAmbulances.length === 0 && (
              <p className="pt-3 text-xs text-muted-foreground text-center">
                নির্ধারিত দূরত্বের মধ্যে অ্যাম্বুলেন্স পাওয়া যায়নি।
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
