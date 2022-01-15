-- Compiled with roblox-ts v1.2.9
local getDebounce = function(id)
	return script:GetAttribute(id)
end
local function setDebounce(id)
	script:SetAttribute(id, time())
end
local function validateDebounce(data)
	local debounce = getDebounce(data.id)
	local conditionTrue
	local _exp = data.conditionType
	repeat
		local _fallthrough = false
		if _exp == ">=" then
			conditionTrue = time() - debounce >= data.validateTime
			_fallthrough = true
		end
		if _fallthrough or _exp == "<=" then
			conditionTrue = time() - debounce <= data.validateTime
		end
		conditionTrue = time() - debounce >= data.validateTime
	until true
	if conditionTrue and data.autoSet then
		setDebounce(data.id)
	end
	return conditionTrue
end
return {
	Get = getDebounce,
	Set = setDebounce,
	Validate = validateDebounce,
}
