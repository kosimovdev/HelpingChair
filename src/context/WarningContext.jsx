import React, {createContext, useContext, useState} from "react";

const WarningContext = createContext();

export const useWarning = () => useContext(WarningContext);

export const WarningProvider = ({children}) => {
    const [obstacle, setObstacle] = useState(null);
    const [obstacleId, setObstacleId] = useState(null);

     const showWarning = (obstacleData) => {
        if (obstacleData.obstacle_id !== obstacleId) {
            setObstacle(obstacleData);   // butun obyektni saqlaymiz
            setObstacleId(obstacleData.obstacle_id);
        }
    };

    const hideWarning = () => {
        setObstacle(null);
        setObstacleId(null);
    };

    return (
        <WarningContext.Provider value={{obstacle, showWarning, hideWarning}}>
            {children}
        </WarningContext.Provider>
    );

    // const showWarning = (type, id) => {
    //     if (id !== obstacleId) {
    //         setObstacle(type);
    //         setObstacleId(id);
    //     }
    // };

    // const hideWarning = () => {
    //     setObstacle(null);
    // };

    // return <WarningContext.Provider value={{obstacle, showWarning, hideWarning}}>{children}</WarningContext.Provider>;
};
