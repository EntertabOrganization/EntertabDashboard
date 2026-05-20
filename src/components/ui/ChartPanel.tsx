export function ChartPanel() {
  const bars = [62, 48, 80, 70, 56, 91];
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "end", height: 180 }}>
      {bars.map((value, index) => (
        <div
          key={index}
          style={{
            width: 32,
            borderRadius: 10,
            height: `${value}%`,
            background: index % 2 ? "var(--primary-soft)" : "var(--primary)"
          }}
        />
      ))}
    </div>
  );
}
