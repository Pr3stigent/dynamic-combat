export = {
	Default: {
		["Basic Combo"]: function (Player: Player, Combo: string, Holding: boolean) {
			print("Swing");
		},
		["Basic Hit"]: function (HitPlayer: Player, Combo: string) {
			print("Hit");
		},
		["Basic Clash"]: function (HitPlayer: Player, Combo: string) {
			print("Clash");
		},
	},
	ComboSequence: {
		["L"]: function () {
			//Fire remote Combo to server
		},
	},
	HitSequence: {
		["L"]: function () {
			//Fire remote Combo to server
		},
	},
	ClashSequence: {
		["LLL"]: function () {
			//Fire remote Combo to server
		},
	},
};
