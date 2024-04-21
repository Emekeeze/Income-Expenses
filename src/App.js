import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';


import './App.css';

function App() {
  const [statements, setStatements] = useState([]);
  const [input, setInput] = useState({
    statement: "",
    amount: "",
    statementType: "income"
  });
  const [showErrors, setShowErrors] = useState({
    statement: false,
    amount: false
  });
  const [total, setTotal] = useState(0)

  const handleUpdateInput = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };

  const handleAddNewStatement = () => {
    const { statement, amount, statementType } = input;
    if (!statement) {
      setShowErrors({
        statement: true,
        amount: false
      });
    } else if (!amount) {
      setShowErrors({
        statement: false,
        amount: true
      });
    } else {
      setStatements([
        ...statements,
        {
          id: uuidv4(),
          name: statement,
          amount: parseFloat(amount).toFixed(2),
          type: statementType,
          date: new Date().toDateString() // Fixed typo here
        }
      ]);
      setInput({
        statement: "",
        amount: "",
        statementType: "income"
      });
      setShowErrors({
        statement: false,
        amount: false
      });
    }
  };
  useEffect(() => {
    const newTotal = statements.reduce((sum, { type, amount }) => {
      if (type === 'expense') {
        return sum - parseFloat(amount);
      } else {
        return sum + parseFloat(amount);
      }
    }, 0);
    setTotal(newTotal);
  }, [statements]); 
  const renderTotal = () => {
    if (total > 0) {
      return <h1 className="total-text success">+{Math.abs(total)}</h1>;
    } else if (total < 0) {
      return <h1 className="total-text danger">-{Math.abs(total)}</h1>;
    } else {
      return <h1 className="total-text">{Math.abs(total)}</h1>;
    }
  };
  
  

  return (
    <main>
      <div>
        {renderTotal()}
        <div className='input-container'>
          <input type='text' placeholder="Income or Expenses" name="statement" style={showErrors.statement ? { borderColor: "rgb(206, 76, 76)" } : {}} value={input.statement} onChange={handleUpdateInput} />
          <input type="number" placeholder="#5000" name="amount" value={input.amount} style={showErrors.amount ? { borderColor: "rgb(206, 76, 76)" } : {}} onChange={handleUpdateInput} />
          <select value={input.statementType} name="statementType" onChange={handleUpdateInput}>
            <option value="expense">expense</option>
            <option value="income">income</option>
          </select>
          <button onClick={handleAddNewStatement} className="success">+</button>
        </div>
        {statements.map(({ name, type, amount, date, id}) => (
          <div key={id} className="card">
            <div className="card-info">
              <h4>{name}</h4>
              <p>{date}</p>
            </div>
            <p className={`amount-text ${type === "income" ? "success" : "danger"}`}>{type === "income" ? "+" : "-"}{amount}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
