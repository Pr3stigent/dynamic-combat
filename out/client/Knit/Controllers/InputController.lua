-- Compiled with roblox-ts v1.2.9
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local UserInputService = TS.import(script, TS.getModule(script, "@rbxts", "services")).UserInputService
local Knit = TS.import(script, TS.getModule(script, "@rbxts", "knit").Knit).KnitClient
local function keysDown(keys)
	local areKeysDown = false
	for _, key in ipairs(keys) do
		if key.EnumType == Enum.KeyCode then
			if UserInputService:IsKeyDown(key) then
				areKeysDown = true
			else
				areKeysDown = false
				break
			end
		elseif key.EnumType == Enum.UserInputType then
			if UserInputService:IsMouseButtonPressed(key) then
				areKeysDown = true
			else
				areKeysDown = false
				break
			end
		end
	end
	return areKeysDown
end
local keyTypeActions = {}
local _arg1 = function(data, callback, key, inputKey)
	task.spawn(callback, inputKey)
end
-- ▼ Map.set ▼
keyTypeActions.Pressed = _arg1
-- ▲ Map.set ▲
local _arg1_1 = function(data, callback, key, inputKey)
	task.spawn(function()
		while true do
			if type(key) == "table" then
				if keysDown(data.ConsistOfKeys) then
					task.spawn(callback, inputKey)
				else
					break
				end
			elseif typeof(key) == "EnumItem" then
				if UserInputService:IsKeyDown(key) then
					task.spawn(callback, inputKey)
				else
					break
				end
			end
			task.wait(data.KeyTime)
		end
	end)
end
-- ▼ Map.set ▼
keyTypeActions.Held = _arg1_1
-- ▲ Map.set ▲
local _arg1_2 = function(data, callback, key, inputKey)
	local newTime = false
	if data.OsClock ~= nil then
		data.OsClock = os.clock()
		newTime = true
	end
	if data.OsClock ~= nil and data.KeyTime ~= nil then
		if not newTime and os.clock() - data.OsClock <= data.KeyTime then
			task.spawn(callback, inputKey)
		end
	end
	data.OsClock = os.clock()
end
-- ▼ Map.set ▼
keyTypeActions.Timed = _arg1_2
-- ▲ Map.set ▲
local function sort(input)
	local buffer = {}
	do
		local i = 1
		local _shouldIncrement = false
		while true do
			if _shouldIncrement then
				i += 1
			else
				_shouldIncrement = true
			end
			if not (i == #input) then
				break
			end
			buffer[i + 1] = string.sub(input, i, i)
		end
	end
	-- ▼ Array.sort ▼
	table.sort(buffer)
	-- ▲ Array.sort ▲
	return table.concat(buffer, ", ")
end
local function enumItemsToStrings(enumItems)
	local newString = {}
	for _, enumItem in ipairs(enumItems) do
		local _arg0 = #newString
		local _name = enumItem.Name
		table.insert(newString, _arg0 + 1, _name)
	end
	return table.concat(newString, ", ")
end
local InputController = Knit.CreateController({
	Name = "InputController",
	cache = {
		SingleKeysDown = {},
		DifferentKeysDown = {},
		MultipleKeysDown = {},
		SingleKeysUp = {},
		DifferentKeysUp = {},
		MultipleKeysUp = {},
	},
	states = {
		MultipleKeys = {},
		DifferentKeys = {},
	},
	KeyDown = function(self, key, callback, data)
		local keyType = if data then data.KeyType else "Pressed"
		local keyTime = if data then data.KeyTime else 0.2
		if type(key) == "table" then
			local keyName = sort(enumItemsToStrings(key))
			if not self.cache.DifferentKeysDown[keyName] then
				-- ▼ Map.set ▼
				self.cache.DifferentKeysDown[keyName] = { {} }
				-- ▲ Map.set ▲
			end
			local cachedKey = self.cache.DifferentKeysDown[keyName]
			if cachedKey ~= nil then
				local _arg0 = #cachedKey
				local _arg1_3 = {
					KeyType = keyType,
					KeyTime = keyTime,
					Callback = callback,
					ConsistOfKeys = key,
				}
				table.insert(cachedKey, _arg0 + 1, _arg1_3)
			end
		elseif typeof(key) == "EnumItem" then
			if not self.cache.SingleKeysDown[key] then
				-- ▼ Map.set ▼
				self.cache.SingleKeysDown[key] = { {} }
				-- ▲ Map.set ▲
			end
			local cachedKey = self.cache.SingleKeysDown[key]
			if cachedKey ~= nil then
				local _arg0 = #cachedKey
				local _arg1_3 = {
					KeyType = keyType,
					KeyTime = keyTime,
					Callback = callback,
				}
				table.insert(cachedKey, _arg0 + 1, _arg1_3)
			end
		end
	end,
	MultipleKeysDown = function(self, keys, callback, data)
		local keyType = if data then data.KeyType else "Pressed"
		local keyTime = if data then data.KeyTime else 0.2
		local keyName = sort(enumItemsToStrings(keys))
		if not self.cache.MultipleKeysDown[keyName] then
			-- ▼ Map.set ▼
			self.cache.MultipleKeysDown[keyName] = { {} }
			-- ▲ Map.set ▲
		end
		local cachedKey = self.cache.MultipleKeysDown[keyName]
		if cachedKey ~= nil then
			local _arg0 = #cachedKey
			local _arg1_3 = {
				KeyType = keyType,
				KeyTime = keyTime,
				Callback = callback,
				ConsistOfKeys = keys,
			}
			table.insert(cachedKey, _arg0 + 1, _arg1_3)
		end
	end,
	KeyUp = function(self, key, callback)
		if type(key) == "table" then
			local keyName = sort(enumItemsToStrings(key))
			if not self.cache.DifferentKeysUp[keyName] then
				-- ▼ Map.set ▼
				self.cache.DifferentKeysUp[keyName] = { {} }
				-- ▲ Map.set ▲
			end
			local cachedKey = self.cache.DifferentKeysUp[keyName]
			if cachedKey ~= nil then
				local _result = cachedKey
				if _result ~= nil then
					_result = #_result
				end
				local _arg1_3 = {
					Callback = callback,
					ConsistOfKeys = key,
				}
				table.insert(cachedKey, _result + 1, _arg1_3)
			end
		elseif typeof(key) == "EnumItem" then
			if not self.cache.SingleKeysUp[key] then
				local _singleKeysUp = self.cache.SingleKeysUp
				local _arg1_3 = { function() end }
				-- ▼ Map.set ▼
				_singleKeysUp[key] = _arg1_3
				-- ▲ Map.set ▲
			end
			local cachedKey = self.cache.SingleKeysUp[key]
			if cachedKey ~= nil then
				local _arg0 = #cachedKey
				table.insert(cachedKey, _arg0 + 1, callback)
			end
		end
	end,
	MultipleKeysUp = function(self, keys, callback)
		local keyName = sort(enumItemsToStrings(keys))
		if not self.cache.MultipleKeysUp[keyName] then
			-- ▼ Map.set ▼
			self.cache.MultipleKeysUp[keyName] = { {} }
			-- ▲ Map.set ▲
		end
		local cachedKey = self.cache.MultipleKeysUp[keyName]
		if cachedKey ~= nil then
			local _result = cachedKey
			if _result ~= nil then
				_result = #_result
			end
			local _arg1_3 = {
				Callback = callback,
				ConsistOfKeys = keys,
			}
			table.insert(cachedKey, _result + 1, _arg1_3)
		end
	end,
	KnitStart = function(self)
		UserInputService.InputBegan:Connect(function(input, gameProccessedevent)
			if gameProccessedevent then
				return nil
			end
			for key, data in pairs(self.cache.MultipleKeysDown) do
				for _, data2 in ipairs(data) do
					local keyType = data2.KeyType
					local callback = data2.Callback
					if data2.ConsistOfKeys == nil then
						return nil
					end
					if keysDown(data2.ConsistOfKeys) then
						local keyAction = keyTypeActions[keyType]
						if keyAction ~= nil then
							keyAction(data2, callback, data2.ConsistOfKeys)
						end
						local _multipleKeys = self.states.MultipleKeys
						local _arg0 = sort(enumItemsToStrings(data2.ConsistOfKeys))
						-- ▼ Map.set ▼
						_multipleKeys[_arg0] = true
						-- ▲ Map.set ▲
					end
				end
			end
			for key, data in pairs(self.cache.DifferentKeysDown) do
				for _, data2 in ipairs(data) do
					local keyType = data2.KeyType
					local callback = data2.Callback
					local inputKey = if input.KeyCode == Enum.KeyCode.Unknown then input.UserInputType else input.KeyCode
					if data2.ConsistOfKeys == nil then
						return nil
					end
					if (table.find(data2.ConsistOfKeys, inputKey) or 0) - 1 ~= nil then
						local keyAction = keyTypeActions[keyType]
						if keyAction ~= nil then
							keyAction(data2, callback, inputKey, inputKey)
						end
						local _differentKeys = self.states.DifferentKeys
						local _arg0 = sort(enumItemsToStrings(data2.ConsistOfKeys))
						if _differentKeys[_arg0] ~= nil then
							local _differentKeys_1 = self.states.DifferentKeys
							local _arg0_1 = sort(enumItemsToStrings(data2.ConsistOfKeys))
							-- ▼ Map.set ▼
							_differentKeys_1[_arg0_1] = {}
							-- ▲ Map.set ▲
						end
						local _differentKeys_1 = self.states.DifferentKeys
						local _arg0_1 = sort(enumItemsToStrings(data2.ConsistOfKeys))
						local stateKey = _differentKeys_1[_arg0_1]
						if stateKey ~= nil then
							stateKey[inputKey.Name] = true
						end
					end
				end
			end
			local inputKey = if input.KeyCode == Enum.KeyCode.Unknown then input.UserInputType else input.KeyCode
			local cacheKey = self.cache.SingleKeysDown[inputKey]
			if cacheKey ~= nil then
				for _, data in ipairs(cacheKey) do
					local keyType = data.KeyType
					local callback = data.Callback
					local keyAction = keyTypeActions[keyType]
					if keyAction ~= nil then
						keyAction(data, callback, inputKey)
					end
				end
			end
		end)
		UserInputService.InputEnded:Connect(function(input, gameProccessedevent)
			if gameProccessedevent then
				return nil
			end
			for key, data in pairs(self.cache.MultipleKeysUp) do
				for _, data2 in ipairs(data) do
					local callback = data2.Callback
					if data2.ConsistOfKeys == nil then
						return nil
					end
					local _multipleKeys = self.states.MultipleKeys
					local _arg0 = sort(enumItemsToStrings(data2.ConsistOfKeys))
					local stateKey = _multipleKeys[_arg0]
					if stateKey ~= nil then
						local areKeysDown = keysDown(data2.ConsistOfKeys)
						if not areKeysDown then
							task.spawn(callback)
						end
						local _multipleKeys_1 = self.states.MultipleKeys
						local _arg0_1 = sort(enumItemsToStrings(data2.ConsistOfKeys))
						-- ▼ Map.set ▼
						_multipleKeys_1[_arg0_1] = false
						-- ▲ Map.set ▲
					end
				end
			end
			for key, data in pairs(self.cache.DifferentKeysUp) do
				for _, data2 in ipairs(data) do
					local callback = data2.Callback
					local inputKey = if input.KeyCode == Enum.KeyCode.Unknown then input.UserInputType else input.KeyCode
					if data2.ConsistOfKeys == nil then
						return nil
					end
					local _differentKeys = self.states.DifferentKeys
					local _arg0 = sort(enumItemsToStrings(data2.ConsistOfKeys))
					local stateKey = _differentKeys[_arg0]
					local _value = stateKey ~= nil and (table.find(data2.ConsistOfKeys, inputKey) or 0) - 1
					if _value ~= 0 and (_value == _value and _value) then
						local areKeysDown = keysDown(data2.ConsistOfKeys)
						if not areKeysDown then
							task.spawn(callback, inputKey)
						end
						stateKey[inputKey.Name] = false
					end
				end
			end
			local inputKey = if input.KeyCode == Enum.KeyCode.Unknown then input.UserInputType else input.KeyCode
			local cacheKey = self.cache.SingleKeysUp[inputKey]
			if cacheKey ~= nil then
				for _, callback in ipairs(cacheKey) do
					task.spawn(callback)
				end
			end
		end)
	end,
})
return InputController
