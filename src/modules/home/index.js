import React, { useEffect, useState } from "react";
import styled from "styled-components";
import OverViewComponent from "./OverViewComponent";
import TransactionsComponent from "./TransactionsComponent";
import axios from 'axios';
const Container = styled.div`
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
        <Container>
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
        </Container>
    );
};
export default HomeComponent;
