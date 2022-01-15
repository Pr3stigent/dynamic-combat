-- Compiled with roblox-ts v1.2.9
-- const CharacterCustomItems = ReplicatedStorage.Assets.CharacterCustomItems
local itemFunctions = {
	Face = function(item, itemNumber, colourBased) end,
	Head = function(item, itemNumber, colourBased) end,
	Clothing = function(item, itemNumber, colourBased) end,
}
return function(actor, data)
	if data ~= nil then
		for item, itemNumber in pairs(data) do
			if item == "Eyes" or item == "Mouth" then
				local _fn = itemFunctions
				local _arg0 = { string.find(item, "Colour") }
				_fn.Face(item, itemNumber, type(_arg0) == "number")
			elseif item == "Shirt" or (item == "Pants" or item == "Shoes") then
				local _fn = itemFunctions
				local _arg0 = { string.find(item, "Colour") }
				_fn.Clothing(item, itemNumber, type(_arg0) == "number")
			elseif item == "Hair" then
				local _fn = itemFunctions
				local _arg0 = { string.find(item, "Colour") }
				_fn.Head(item, itemNumber, type(_arg0) == "number")
			end
		end
	end
	return actor
end
