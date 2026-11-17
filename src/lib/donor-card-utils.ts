export function getTierInfo(count: number) {
  if (count >= 10) {
    return {
      title: "গোল্ড ডোনার",
      bg: "#FEF3C7",
      text: "#92400E",
      border: "#FDE68A",
    };
  }
  if (count >= 5) {
    return {
      title: "সিলভার ডোনার",
      bg: "#E8EDF2",
      text: "#2C3E50",
      border: "#CBD5E1",
    };
  }
  return {
    title: "ব্রোঞ্জ ডোনার",
    bg: "#FBEBDD",
    text: "#7A3E10",
    border: "#F2C4CC",
  };
}

