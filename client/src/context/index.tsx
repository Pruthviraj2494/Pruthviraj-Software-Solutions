import React from 'react'

export const AuthContext = React.createContext<any>(null)
export const AuthProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>

export const SocketContext = React.createContext<any>({ socket: null, messages: [], sendMessage: () => {} })
export const SocketProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>
