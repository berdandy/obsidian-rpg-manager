import {TFile} from "obsidian";
import {DataType} from "../enums/DataType";
import {Campaign} from "../data/Campaign";
import {Adventure} from "../data/Adventure";
import {Session} from "../data/Session";
import {Scene} from "../data/Scene";
import {Character} from "../data/Character";
import {Faction} from "../data/Faction";
import {Clue} from "../data/Clue";
import {Location} from "../data/Location";
import {Event} from "../data/Event";
import {Timeline} from "../data/Timeline";
import {Note} from "../data/Note";
import {AbstractFactory} from "../abstracts/AbstractFactory";
import {CampaignSetting} from "../enums/CampaignSetting";
import {VampireCharacter} from "../rpgs/Vampire/data/VampireCharacter";
import {RawCampaign} from "../rpgs/Raw/data/RawCampaign";
import {Music} from "../data/Music";
import {Id} from "../database/Id";


const DatasMap = {
	AgnosticCampaign: Campaign,
	AgnosticAdventure: Adventure,
	AgnosticSession: Session,
	AgnosticScene: Scene,
	AgnosticCharacter: Character,
	AgnosticNonPlayerCharacter: Character,
	AgnosticFaction: Faction,
	AgnosticClue: Clue,
	AgnosticLocation: Location,
	AgnosticEvent: Event,
	AgnosticTimeline: Timeline,
	AgnosticNote: Note,
	VampireCharacter: VampireCharacter,
	VampireNonPlayerCharacter: VampireCharacter,
	RawCampaign: RawCampaign,
	AgnosticMusic: Music,
};
type DatasMapType = typeof DatasMap;
type DataKeys = keyof DatasMapType;
type Tuples<T> = T extends DataKeys ? [T, InstanceType<DatasMapType[T]>] : never;
type SingleDataKey<K> = [K] extends (K extends DataKeys ? [K] : never) ? K : never;
type DataClassType<A extends DataKeys> = Extract<Tuples<DataKeys>, [A, any]>[1];

export class DataFactory extends AbstractFactory {
	public create<K extends DataKeys>(
		settings: CampaignSetting,
		file: TFile,
		id: Id,
	): DataClassType<K> {
		let dataKey: SingleDataKey<K> = CampaignSetting[settings] + DataType[id.type] as SingleDataKey<K>;
		if (DatasMap[dataKey] == null && settings !== CampaignSetting.Agnostic){
			dataKey = CampaignSetting[CampaignSetting.Agnostic] + DataType[id.type] as SingleDataKey<K>;
		}

		return new DatasMap[dataKey](this.app, file, id);
	}
}
