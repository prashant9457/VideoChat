type BottomDockProps = {
  children: React.ReactNode;
};

export default function BottomDock({ children }: BottomDockProps) {
  return (
    <div className="bottom-dock">
      {children}
    </div>
  );
}