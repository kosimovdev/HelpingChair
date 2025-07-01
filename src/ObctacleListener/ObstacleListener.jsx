import React, {useEffect, useRef} from "react";
import {getLatestObstacle} from "../../services/Warning/Warning";
import {useWarning} from "../../contexts/WarningContext"; // Context joylashgan joyga qarab o‘zgartiring

const ObstacleListener = ({userId, walkerId}) => {
    const shownObstacleIds = useRef(new Set());
    const {showWarning} = useWarning();

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const data = await getLatestObstacle(userId, walkerId);

                if (data.is_detected === 1 && data.obstacle_id && !shownObstacleIds.current.has(data.obstacle_id)) {
                    showWarning(data.obstacle_type, data.obstacle_id);
                    shownObstacleIds.current.add(data.obstacle_id);
                }
            } catch (error) {
                console.error("Obstacle fetch error:", error);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [userId, walkerId, showWarning]);

    return null; // hech nima render qilmaydi, faqat listening qiladi
};

export default ObstacleListener;
