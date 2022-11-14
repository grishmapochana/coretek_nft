import React, { FC } from "react";

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {};

const Button: FC<Props> = (props) => {
  return (
    <button
      className="bg-gray-200 p-2 rounded shadow-lg hover:bg-gray-300 transition ease-in-out"
      {...props}
    />
  );
};

export default Button;
