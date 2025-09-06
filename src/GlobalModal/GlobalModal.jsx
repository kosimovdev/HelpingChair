import WarningModal from "../WarningModal/Warningmodal";
import { useWarning } from "../context/WarningContext";

const GlobalWarningModal = () => {
    const {obstacle, hideWarning} = useWarning();

    if (!obstacle) return null;

    return <WarningModal obstacle={obstacle} onClose={hideWarning} />;
};

export default GlobalWarningModal;
