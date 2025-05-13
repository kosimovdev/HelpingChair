const MJPEGPlayer = ({streamUrl}) => {
    return (
        <img
            src={streamUrl}
            alt="Live MJPEG Stream"
            className="w-[380px] h-[400px] object-cover rounded-2xl shadow-md"
        />
    );
};

export default MJPEGPlayer;
