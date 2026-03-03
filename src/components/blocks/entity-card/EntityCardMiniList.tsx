type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function EntityCardMiniList({ children, className }: Props) {
  return (
    <div className={`entity-card-mini-rail ${className ?? ""}`}>
      {children}
    </div>
  );
}