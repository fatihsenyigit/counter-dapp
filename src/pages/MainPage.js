import { ethers, formatEther } from 'ethers'
import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row, Input } from 'reactstrap';
import Counter from "../contract/Counter.json"

export default function MainPage() {

    const [address, setAddress] = useState("")
    const [signer, setSigner] = useState(null)
    const [provider, setProvider] = useState(null)
    const [balance, setBalance] = useState("");
    const [counter, setCounter] = useState(null)
    const [number, setNumber] = useState("")
    const [inputValue, setInputValue] = useState("");
    

    useEffect(() => {
        
        const eth = window?.ethereum || null;
        const _provider = eth? new ethers.BrowserProvider(window.ethereum, "any") : null;
        setProvider(_provider)
        if(_provider) {
            (async()=>{
                const _signer = await _provider.getSigner();
                setSigner(_signer);
                const _address = (await _signer.getAddress()) || null;
            if(_address){
                const _balance = await  _provider.getBalance(_address);
                setBalance(formatEther(_balance))
                setAddress(_address);
                }

            const _counter = new ethers.Contract(
                "0x8467aEa59e8C230b3191CFb0400fc3b7b2Be881C",
                Counter.abi,
                _signer,
            );
            setCounter(_counter);
            const _number = await _counter.counterNumber();
            console.log(_number);
            const aaa =  Number(_number)
                console.log(aaa);
            setNumber(aaa)
          
            })();
            
        }                              
    }, [])

   
    

    const connectMetamask = async()=> {
        try {
            await provider.send("eth_requestAccounts", [])
        const _signer = await provider.getSigner();
        setSigner(_signer);
        const _address = await _signer.getAddress();
        setAddress(_address);
        const _balance = await  provider.getBalance(_address);
        setBalance(formatEther(_balance))
        } catch (error) {
            console.log(error);
        }
    }

    const getNumber = async() => {
        try {
            const _counter = new ethers.Contract(
                "0x8467aEa59e8C230b3191CFb0400fc3b7b2Be881C",
                Counter.abi,
                signer,
            );
            console.log(_counter);
            // setCounter(_counter);
            const _number = await _counter.counterNumber();
            console.log(_number);
            const aaa =  Number(_number)
                console.log(aaa);
            setNumber(aaa)
        } catch (error) {
            console.log(error);
        }
    }
    const handleChange = (event) => {
        setInputValue(event.target.value);
        
      };

    const onIncrement = async() => {
        setInputValue("")
        try {
                const tx = await counter.increment(inputValue);
                const result = await tx.wait();
                const _number = await counter.counterNumber();
            const aaa =  Number(_number)
                
            setNumber(aaa)
            
              
        } catch (error) {
            console.log(error);
        }
    }

    const onDecrement = async() => {
        try {
            const tx = await counter.decrement(inputValue);
            const result = await tx.wait();
            const _number = await counter.counterNumber();
            const aaa =  Number(_number)
                
            setNumber(aaa)
        } catch (error) {
            console.log(error);
        }
    }

   
      
    
  return (
    <div>
        <Container style={{marginTop:50}}>
            <Row>
                {provider && !address? (<Col><Button onClick={connectMetamask} style={{fontWeight:700}} color='warning'>connect metamask</Button></Col>)
                :provider && address ? (<>
                <Col><Button  style={{fontWeight:700}} color='warning'>{address}</Button></Col>
                <Col><Button  style={{fontWeight:700}} color='warning'>{balance}</Button></Col>
                </>)
                :
                (<Col><Button href='https://metamask.io/download/' style={{fontWeight:700, color:"black"}} color='warning'> install metamask</Button></Col>)}
            </Row>
            <br></br>
            <Row>
                <Col>
                <Button onClick={getNumber}>getNumber</Button>
                <br></br>
                <br></br>
                <h3>your number is: {number}</h3>
                </Col>
                
            </Row>
            <br></br>
            <Row>
                <Col >
                <Input placeholder='please enter a positif number'
                type="number"
                value={inputValue}
                onChange={handleChange}>
                </Input>
                </Col>
                <Col >
                <Button style={{marginRight:"5px"}} onClick={onIncrement}>increment</Button>
                <Button style={{marginLeft:"5px"}} onClick={onDecrement}>decrement</Button>
                
                <Button style={{marginLeft:"5px"}} >{inputValue}</Button>
                </Col>
                
            </Row>
            <br></br>
            <Row>
            <h3>{inputValue && inputValue < 0 && <span>Please enter a valid positive number</span>}</h3>
            </Row>
        </Container>
    </div>
  )
}
