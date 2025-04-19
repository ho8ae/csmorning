const VoteSection = ({ debateStats = {}, onStanceSelect, selectedStance = null }) => {
    const { 
      forCount = 0, 
      againstCount = 0, 
      forPercentage = '0.0', 
      againstPercentage = '0.0' 
    } = debateStats;
    
    const totalVotes = forCount + againstCount;
    
    return (
      <div className="p-4 mt-6 bg-white rounded-lg shadow-sm">
        <h3 className="mb-3 text-lg font-bold">투표 결과</h3>
        
        <div className="flex w-full mb-3 overflow-hidden bg-gray-200 rounded-full h-7">
          <div
            className="h-full bg-green-500"
            style={{ width: `${forPercentage}%` }}
          ></div>
          <div
            className="h-full bg-red-500"
            style={{ width: `${againstPercentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between mb-4 text-sm">
          <div>
            <span className="font-medium text-green-600">{forPercentage}%</span>
            <span className="ml-1 text-gray-500">({forCount}명)</span>
          </div>
          <div>
            <span className="font-medium text-red-600">{againstPercentage}%</span>
            <span className="ml-1 text-gray-500">({againstCount}명)</span>
          </div>
        </div>
        
        <div className="text-center">
          <p className="mb-3 text-sm text-gray-500">
            {totalVotes > 0 
              ? `총 ${totalVotes}명이 이 토론에 참여했습니다.` 
              : '아직 참여한 사람이 없습니다. 첫 번째 의견을 남겨보세요!'}
          </p>
          
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => onStanceSelect('for')}
              className={`px-4 py-2 text-sm font-medium rounded-full ${
                selectedStance === 'for'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              찬성
            </button>
            <button
              onClick={() => onStanceSelect('against')}
              className={`px-4 py-2 text-sm font-medium rounded-full ${
                selectedStance === 'against'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
            >
              반대
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default VoteSection;