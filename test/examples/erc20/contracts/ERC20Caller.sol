import "ERC20.sol";
contract ERC20Caller {

    function callERC20ApproveWithSelector(address tokenAddress, address spender, uint256 amount)
    public
    virtual
    returns (bool)
    {
        ERC20 token = ERC20(tokenAddress);
        bytes data = abi.encodeWithSignature("approve(address,uint256)", spender, uint256(amount));
        (bool success, bytes rawresult) = address(token).call(data);
        assert(success == true);
        bool res = abi.decode(rawresult, (bool));
        assert(res);
        return res;
    }

    function callERC20ApproveByFunction(address tokenAddress, address spender, uint256 amount)
    public
    virtual
    returns (bool)
    {
        ERC20 token = ERC20(tokenAddress);
        bool res = token.approve(spender, amount);
        assert(res);
        return res;
    }
}