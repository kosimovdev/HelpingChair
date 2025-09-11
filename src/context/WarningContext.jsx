import React, {createContext, useContext, useState} from "react";

const WarningContext = createContext();

export const useWarning = () => useContext(WarningContext);

export const WarningProvider = ({children}) => {
    const [obstacle, setObstacle] = useState(null);
    const [obstacleId, setObstacleId] = useState(null);
     const [dismissedIds, setDismissedIds] = useState([]); // <-- yangi massiv

     const showWarning = (obstacleData) => {
        // agar bu id dismissed bo‘lgan bo‘lsa, qayta ko‘rsatmaymiz
        if (dismissedIds.includes(obstacleData.obstacle_id)) {
            return;
        }

        // agar hozirgi id bilan bir xil bo‘lmasa, modal ochamiz
        if (obstacleData.obstacle_id !== obstacleId) {
            setObstacle(obstacleData);   // butun obyektni saqlaymiz
            setObstacleId(obstacleData.obstacle_id);
        }
    };

    const hideWarning = (id) => {
          // modal yopilganda id ni dismissed qatoriga qo‘shamiz
        if (id) {
            setDismissedIds((prev) => [...prev, id]);
        }
        setObstacle(null);
        setObstacleId(null);
    };

    return (
        <WarningContext.Provider value={{obstacle, showWarning, hideWarning}}>
            {children}
        </WarningContext.Provider>
    );
};
