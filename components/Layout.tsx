import React, { Component, ReactNode } from "react";
import Header from "./header";
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";

interface Props {
    children?: ReactNode
    // any props that come into the component
}

function getLibrary(provider: any) {
  return new Web3(provider);
}

export default function Layout({children}: Props) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
    <div>
        <Header />
        {children}
    </div>
</Web3ReactProvider>
  );
  };
