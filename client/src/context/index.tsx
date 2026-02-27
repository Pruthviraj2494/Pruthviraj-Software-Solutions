import React from 'react'

export const SocketContext = React.createContext<any>({ socket: null, messages: [], sendMessage: () => {} })
export const SocketProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>
