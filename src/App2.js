import styled from "styled-components";
import axios from 'axios';
import React, { useEffect, useState } from "react";
const Container = styled.div`
  background-color: white;
  color: #0d1d2c;
  display: flex;
  flex-direction: column;
  margin: 0 10px;
  align-items: center;
  height: 100vh;
  width: 98%;
  padding-top: 30px ;
  font-family: Montserrat;
`;

const Container1 = styled.div`
  background-color: white;
  color: #0d1d2c;
  display: flex;
  flex-direction: column;
  padding: 10px 22px;
  font-size: 18px;
  width: 360px;
  align-items: center;
  justify-content: space-between;
`;

const Header = styled.div`
  background-color: white;
  color: #0d1d2c;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 22px;
  font-size: 25px;
  font-weight: bold;
`;


const HomeComponent = (props) => {
    const [transactions, updateTransaction] = useState([]);
    const [expense, updateExpense] = useState(0);
    // const [income, updateIncome] = useState(0);

    const calculateBalance = () => {
        let exp = 0;
        transactions.map((payload) =>
            exp=exp+payload.amt
        );
        updateExpense(exp);
    };
    useEffect(() => calculateBalance(), [transactions]);
    useEffect(() => {
        const transactionArray = [...transactions];
        axios.get(`http://127.0.0.1:5000/api/users/${1}/expenses`).then(res=>{
            console.log(res);
            res.data.map(val=>{
                let item = {amt:val.amt,desc:val.desc,category:val.category}
                transactionArray.push(item);
            });
            updateTransaction(transactionArray);
        })
    },[])
    const addTransaction = (payload) => {
        const transactionArray = [...transactions];
        // fetch()
        axios.post(`http://127.0.0.1:5000/api/users/${1}/expenses`,{
            desc:payload.desc,
            amt:payload.amt,
            category:payload.category
        }).then((res)=>{console.log(res)});
        transactionArray.push(payload);
        updateTransaction(transactionArray);
    };
    return (
        <Container1>
            <OverViewComponent
                expense={expense}
                // income={income}
                addTransaction={addTransaction}
            />
            {transactions?.length ? (
                <TransactionsComponent transactions={transactions} />
            ) : (
                ""
            )}
        </Container1>
    );
};

const Container2 = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  align-items: center;
  font-size: 16px;
  width: 100%;
`;
const BalanceBox = styled.div`
  font-size: 18px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-weight: bold;
  & span {
    color: #0d1d2c;
    opacity: 80%;
    font-weight: bold;
    font-size: 20px;
  }
`;
const AddTransaction =styled.div`
  font-size: 15px;
  background: #0d1d2c;
  display: flex;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  flex-direction: row;
  border-radius: 4px;
  font-weight: bold;
`;
const AddTransactionContainer = styled.div`
  font-size: 15px;
  display: ${(props) => (props.isAddTxnVisible ? "flex" : "none")};
  color: #0d1d2c;
  flex-direction: column;
  border-radius: 4px;
  border: 1px solid #e6e8e9;
  width: 100%;
  align-items: center;
  padding: 15px 20px;
  margin: 10px 20px;
  gap: 10px;
  & input {
    width: 90%;
    outline: none;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid #e6e8e9;
  }
`;

const AddTransactionView = (props) => {
  const [amt, setAmt] = useState();
  const [desc, setDesc] = useState();
  const [category, setCategory] = useState();
  // const [type, setType] = useState("EXPENSE");
  const [check,setCheck]=useState(false);

  useEffect(()=>{
    if(!amt)
    {
      setCheck(false);
    }
    else{
      setCheck(true);
    }

  },[amt]);
  return (
    <AddTransactionContainer isAddTxnVisible={props.isAddTxnVisible}>
      <input
        placeholder="Amount"
        type="number"
        value={amt}
        onChange={(e) => setAmt(e.target.value)}
        />
      <input
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <input
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      {check &&<AddTransaction
        onClick={() =>
          props.addTransaction({
            id: Date.now(),
            amt: Number(amt),
            desc,
            category,
          })
        }
      >
        Add Transaction
      </AddTransaction>}
    </AddTransactionContainer>
  );
};
const OverViewComponent = (props) => {
  const [isAddTxnVisible, toggleAddTXn] = useState(false);
  return (
    <Container2>
      <BalanceBox>
        Expense: ${props.expense}
        <AddTransaction onClick={() => toggleAddTXn((isVisible) => !isVisible)}>
          {isAddTxnVisible ? "CANCEL" : "ADD"}
        </AddTransaction>
      </BalanceBox>
      {isAddTxnVisible && (
        <AddTransactionView
          isAddTxnVisible={isAddTxnVisible}
          addTransaction={(payload) => {
            props.addTransaction(payload);
            toggleAddTXn((isVisible) => !isVisible);
          }}
        />
      )}
    </Container2>
  );
};
const Container3 = styled.div`
  background-color: white;
  color: #0d1d2c;
  display: flex;
  flex-direction: column;
  padding: 10px 22px;
  font-size: 18px;
  width: 100%;
  gap: 10px;
  font-weight: bold;
  overflow-y: auto !important;
  & input {
    padding: 10px 12px;
    border-radius: 12px;
    background: #e6e8e9;
    border: 1px solid #e6e8e9;
    outline: none;
  }
`;
const Cell = styled.div`
  background-color: white;
  color: #0d1d2c;
  display: flex;
  flex-direction: row;
  padding: 10px 15px;
  font-size: 14px;
  border-radius: 2px;
  border: 1px solid #e6e8e9;
  align-items: center;
  font-weight: normal;
  justify-content: space-between;
  border-right: 4px solid ${(props) => (props.isExpense ? "red" : "green")};
`;
const TransactionCell = (props) => {
  return (
    <Cell isExpense="true">
      <span>{props.payload?.category}</span>
      <span>{props.payload?.desc}</span>
      <span>${props.payload?.amt}</span>
    </Cell>
  );
};
const TransactionsComponent = (props) => {
  const [searchText, updateSearchText] = useState("");
  const [filteredTransaction, updateTxn] = useState(props.transactions);

  const filterData = (searchText) => {
    if (!searchText || !searchText.trim().length) {
      updateTxn(props.transactions);
      return;
    }
    let txn = [...props.transactions];
    txn = txn.filter((payload) =>
      payload.desc.toLowerCase().includes(searchText.toLowerCase().trim()),
    );
    updateTxn(txn);
  };

  useEffect(() => {
    filterData(searchText);
  }, [props.transactions]);

  return (
    <Container3>
      Transactions
      <input
        placeholder="Search"
        onChange={(e) => {
          updateSearchText(e.target.value);
          filterData(e.target.value);
        }}
      />
      {filteredTransaction?.map((payload) => (
        <TransactionCell payload={payload} />
      ))}
    </Container3>
  );
};
const App2 = () => {
  return (
    <Container>
      <Header>Expense Tracker</Header>
      <HomeComponent />
    </Container>
  );
};

export default App2;
