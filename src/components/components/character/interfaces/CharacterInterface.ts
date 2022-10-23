import {ComponentInterface} from "../../../interfaces/ComponentInterface";
import {Pronoun} from "../../../enums/Pronoun";
import {CharacterDataInterface} from "./CharacterDataInterface";
import {DateInterface} from "../../../../services/date/interfaces/DateInterface";

export interface CharacterInterface extends ComponentInterface, CharacterDataInterface {
	get dob(): DateInterface | undefined;
	get death(): DateInterface | undefined;
	get goals(): string | undefined;
	get pronoun(): Pronoun | undefined;

	get age(): number|undefined;
	get isDead(): boolean;
}
