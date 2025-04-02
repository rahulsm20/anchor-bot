import { LoaderCircle } from "lucide-react";

type LoaderSpinProps = React.HTMLAttributes<HTMLDivElement> & {
  loading: boolean;
};

const LoaderSpin = ({ loading, ...props }: LoaderSpinProps) => {
  if (!loading) return null;
  return (
    <LoaderCircle size="2rem" className={"animate-spin " + props.className} />
  );
};

export default LoaderSpin;
