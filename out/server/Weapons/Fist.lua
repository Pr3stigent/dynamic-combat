-- Compiled with roblox-ts v1.2.9
return {
	Default = {
		["Basic Combo"] = function(self, Player, Combo, Holding)
			print("Swing")
		end,
		["Basic Hit"] = function(self, HitPlayer, Combo)
			print("Hit")
		end,
		["Basic Clash"] = function(self, HitPlayer, Combo)
			print("Clash")
		end,
	},
	ComboSequence = {
		L = function(self) end,
	},
	HitSequence = {
		L = function(self) end,
	},
	ClashSequence = {
		LLL = function(self) end,
	},
}
