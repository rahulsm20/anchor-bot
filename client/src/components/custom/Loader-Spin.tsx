import { Ellipsis, LoaderCircle } from "lucide-react";

type LoaderSpinProps = React.HTMLAttributes<HTMLDivElement> & {
  loading: boolean;
};

const LoaderSpin = ({ loading, ...props }: LoaderSpinProps) => {
  if (!loading) return null;
  return (
    <LoaderCircle size="2rem" className={"animate-spin " + props.className} />
  );
};

export const LoaderEllipsis = ({ loading, ...props }: LoaderSpinProps) => {
  if (!loading) return null;
  return (
    <div className={`animate-pulse ${props.className}`}>
      <Ellipsis size="2rem" />
    </div>
  );
};

export default LoaderSpin;
