import { Text, Layout, List, Button, Divider, Card, Input, Icon } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react'
// import AsyncStorage from '@react-native-async-storage/async-storage';
import global from '../global';
// import { ScrollView } from 'react-native-web';

const data = new Array(8).fill({
    title: 'Item',
});

export default function Transactions() {

    const [transactions, setTransactions] = useState([]);
    const [phoneNo, setPhoneNo] = useState(null);
    useEffect(() => {
        fetchTransactions();
    }, []);

    const [searchString, setSearchString] = useState('');
    const [searchItems, setSearchItems] = useState([]);


    async function fetchTransactions() {
        // const mobNo = await AsyncStorage.getItem('phone');
        // var result = await fetch("http://192.168.137.1:3000/previousTransactions", {
        //     method: "POST",
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(
        //         {
        //             phone: mobNo,
        //         }
        //     )
        // });
        // result = await result.json();

        // console.log(result);

        // setPhoneNo(await AsyncStorage.getItem('phone'));
        // setTransactions(result.transactions);
        // setSearchItems(result.transactions);
    }

    // useEffect(() => {
    //     searchTransaction();
    // }, [searchString]);

    // function searchTransaction() {

    //     if(searchString.length == 0) {
    //         setSearchItems(transactions);
    //         return;
    //     }

    //     var t = transactions.filter(x => JSON.stringify(x).includes(searchString));

    //     setSearchItems(t);
    // }

    // const AmountRight = ({ amount, type, status }) => {
    //     return (status == 'FAILURE' ? <Text status={'primary'}>Fail</Text> : type == 'credit' ? <Text status={'success'}>{amount}</Text> : <Text status={'danger'}>{amount}</Text>)
    // }

    const renderItem = ({ item, index }) => {
        // console.log(item.fro);
        // const date = new Date(item.time);
        // console.log(date);
        // return <ListItem
        //     style={{height:60}}
        //     title={`${item.from} -> ${item.to}`}
        //     description={new Date(item.time).toDateString()}
        // ><AmountRight amount={item.amount} type={phoneNo == item.from ? 'debit' : 'credit'} status={item.status}/></ListItem>
        return <Card
        // footer={}
        >
            <Layout>
                <Text>id: {item._id}</Text>
                <Text>from: {item.from}</Text>
                <Text>to:{item.to}</Text>
                <Text>time: {new Date(item.time).toLocaleString()} </Text>
                <Text>status: {item.status}</Text>
                <AmountRight amount={item.amount} type={item.to == 'self' ? 'credit' : (phoneNo == item.from ? 'debit' : 'credit')} status={item.status} />
                <Text>hash: {item.transactionHash}</Text>
            </Layout>
        </Card>
    }

    return (
        <Layout style={{ flex: 1 }}>
            {transactions.length > 0 ? 
            <Layout>
                <Layout style={{ flexDirection: 'row' }}>
                    <Input 
                        style={{ margin: 5, width:'80%' }}
                        placeholder={'Search'}
                        value={searchString}
                        onChangeText={(val) => {
                            setSearchString(val);
                            // searchTransaction();
                        }}
                    ></Input>
                    <Button onPress={() => {
                        fetchTransactions();
                    }}>Get</Button>
                </Layout>
                {/* <ScrollView> */}
                    <List
                        // style = {{maxHeight:650}}
                        data={searchItems}
                        ItemSeparatorComponent={<Divider />}
                        renderItem={renderItem}
                    /> 
                {/* </ScrollView>    */}
            </Layout>
            :
                <Layout style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text>No Previous Transactions</Text>
                    <Button style={{ margin: 15 }} onPress={() => { fetchTransactions(); }}>Fetch</Button>
                </Layout>}
        </Layout>
    )
}