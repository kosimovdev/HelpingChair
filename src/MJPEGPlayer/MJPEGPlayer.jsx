const MJPEGPlayer = ({streamUrl}) => {
    return (
        <img
            src={streamUrl}
            alt="Live MJPEG Stream"
            className="w-[600px] h-[680px] object-cover rounded-2xl shadow-md"
        />
    );
};

export default MJPEGPlayer;
