const Loading = ({ message = "데이터를 불러오는 중..." }) => {
    return (
      <div className="flex items-center justify-center flex-grow">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-lg font-medium text-blue-800">{message}</p>
      </div>
    );
  };
  
  export default Loading;