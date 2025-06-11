const MJPEGPlayer = ({streamUrl}) => {
    return (
        <img
            src={streamUrl}
            alt="Live MJPEG Stream"
            className="w-full h-[680px] object-cover rounded-2xl shadow-md"
        />
    );
};

export default MJPEGPlayer;
