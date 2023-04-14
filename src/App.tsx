import { useEffect, useState } from "react";
import { z } from "zod";

type Argument = {
  name: string;
  value: boolean;
};

// Expression will be modeled like a tree
// has either a branch (operator) or leaf (operand)

type ExprNode =
  | {
      type: "AND" | "OR";
      left?: ExprNode;
      right?: ExprNode;
    }
  | {
      type: "constant" | "argument";
      value: boolean;
    };

function App() {
  const [args, setArgs] = useState<Argument[]>([]);
  const [expression, setExpression] = useState<ExprNode>();

  const evaluate = (expression?: ExprNode): boolean | undefined => {
    if (!expression) {
      return false;
    }

    if (expression.type === "constant" || expression.type === "argument") {
      return expression.value;
    }

    if (expression.type === "AND") {
      return evaluate(expression.left) && evaluate(expression.right);
    }

    if (expression.type === "OR") {
      return evaluate(expression.left) || evaluate(expression.right);
    }
  };

  return (
    <>
      {args.map((arg, index) => (
        <div key={index}>
          <input
            type="text"
            value={arg.name}
            className="m-1 border border-gray-800"
            placeholder="arg"
            onChange={(e) => {
              setArgs((prev) =>
                prev.map((a, i) =>
                  i === index ? { ...a, name: e.target.value } : a
                )
              );
            }}
          />
          <input
            type="checkbox"
            checked={arg.value}
            placeholder="value"
            onChange={(e) => {
              setArgs((prev) =>
                prev.map((a, i) =>
                  i === index ? { ...a, value: e.target.checked } : a
                )
              );
            }}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => setArgs((prev) => [...prev, { name: "", value: false }])}
      >
        add arg +
      </button>

      <hr />

      <ExpressionOptions args={args} setRoot={setExpression} />

      <p>Result: {String(evaluate(expression))}</p>
    </>
  );
}

const ExpressionOptions: React.FC<{
  args: Argument[];
  setRoot?: ReturnType<typeof useState<ExprNode>>[1];
  updateNode?: (node?: ExprNode) => void;
}> = ({ args, setRoot, updateNode }) => {
  const [node, setNode] = useState<ExprNode>();
  const [option, setOption] = useState(node?.type ?? "");

  const changeLeft = (node?: ExprNode) =>
    setNode((prev) =>
    (prev?.type === "AND" || prev?.type === "OR") ? { ...prev, left: node } : prev
    );

  const changeRight = (node?: ExprNode) =>
    setNode((prev) =>
      (prev?.type === "AND" || prev?.type === "OR") ? { ...prev, right: node } : prev
    );

  useEffect(() => {
    if (setRoot) {
      setRoot(node);
      return;
    }
    if (updateNode) updateNode(node);
  }, [node]);

  return (
    <div>
      <select
        title="operation"
        className="m-1 border border-gray-800"
        onChange={(e) => {
          const optionSchema = z.enum(["AND", "OR", "constant", "argument"]);

          const option = optionSchema.safeParse(e.currentTarget.value);

          if (!option.success) {
            setNode(undefined);
            setOption("");
            return;
          }

          setOption(option.data);

          setNode(
            (option.data === "AND" || option.data === "OR")
              ? { type: option.data }
              : { type: option.data, value: false }
          );
        }}
      >
        <option defaultChecked value="">
          select...
        </option>
        <option value="AND">AND</option>
        <option value="OR">OR</option>
        <option value="constant">constant</option>
        <option value="argument">argument</option>
      </select>

      {(option === "AND" || option === "OR") && (
        <div className="ml-4">
          <ExpressionOptions args={args} updateNode={changeLeft} />
          <ExpressionOptions args={args} updateNode={changeRight} />
        </div>
      )}

      {option === "argument" && (
        <div className="ml-4">
          <select
            title="arguments"
            className="m-1 border border-gray-800"
            onChange={(e) => {
              if (e.currentTarget.value === "") {
                setNode(undefined);
                return;
              }

              setNode({
                type: "argument",
                value: e.currentTarget.value === "true",
              });
            }}
          >
            <option defaultChecked value="">
              select...
            </option>
            {args.map((arg, idx) => (
              <option key={idx} value={String(arg.value)}>
                {arg.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {option === "constant" && (
        <div className="ml-4">
          <select
            title="constants"
            className="m-1 border border-gray-800"
            onChange={(e) => {
              if (e.currentTarget.value === "") {
                setNode(undefined);
                return;
              }

              setNode({
                type: "constant",
                value: e.currentTarget.value === "true",
              });
            }}
          >
            <option defaultChecked value="">
              select...
            </option>
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default App;
