type GreetingProps = {
  name: string;
};

const Greeting = ({ name }: GreetingProps) => {
  return (
    <div>
      <h2>Hello, {name}!</h2>
    </div>
  );
};

export default Greeting;
