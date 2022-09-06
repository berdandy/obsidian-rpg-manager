import {ResponseDataInterface} from "../interfaces/response/ResponseDataInterface";
import {ModelInterface} from "../interfaces/ModelInterface";
import {App} from "obsidian";
import {DataType} from "../enums/DataType";
import {BreadcrumbResponseInterface} from "../interfaces/response/BreadcrumbResponseInterface";
import {ResponseBreadcrumb} from "../data/responses/ResponseBreadcrumb";
import {RpgDataInterface, SceneInterface, SessionInterface} from "../Data";

export abstract class AbstractModel implements ModelInterface {

	protected dataType: DataType;

	constructor(
		protected app: App,
		protected currentElement: RpgDataInterface,
		protected source: string,
		protected sourcePath: string,
		protected contentEl: HTMLElement,
		protected sourceMeta: any,
	) {
	}

	protected generateBreadcrumb(
	): BreadcrumbResponseInterface {
		const response = new ResponseBreadcrumb();
		response.link = this.currentElement.campaign.link;
		response.title = DataType[DataType.Campaign];

		if (this.currentElement.type !== DataType.Campaign){
			response.mainTitle = DataType[this.currentElement.type];

			let sessionBreadcrumb, sceneBreadcrumb: BreadcrumbResponseInterface;
			const adventureBreadcrumb = new ResponseBreadcrumb();
			const elementBreadcrumb = new ResponseBreadcrumb();
			switch (this.dataType) {
				case DataType.Adventure:
					adventureBreadcrumb.link = this.currentElement.link.toString();
					adventureBreadcrumb.title = DataType[this.currentElement.type];
					response.nextBreadcrumb = adventureBreadcrumb;
					break;
				case DataType.Session:
						adventureBreadcrumb.link = (<SessionInterface>this.currentElement).adventure.link;
						adventureBreadcrumb.title = DataType[DataType.Adventure];
						response.nextBreadcrumb = adventureBreadcrumb;

						sessionBreadcrumb = new ResponseBreadcrumb();
						sessionBreadcrumb.link = this.currentElement.link;
						sessionBreadcrumb.title = DataType[DataType.Session];
						adventureBreadcrumb.nextBreadcrumb = sessionBreadcrumb;

						const previousSessionBreadcrumb = new ResponseBreadcrumb();
						const nextSessionBreadcrumb = new ResponseBreadcrumb();

						if ((<SessionInterface>this.currentElement).previousSession != null) {
							previousSessionBreadcrumb.link = (<SessionInterface>this.currentElement).previousSession?.link!;
							previousSessionBreadcrumb.linkText = '<< prev session';
							previousSessionBreadcrumb.isInNewLine = true;
							sessionBreadcrumb.nextBreadcrumb = previousSessionBreadcrumb;
						}

						const sessionNotesBreadcrumb = new ResponseBreadcrumb();
						sessionNotesBreadcrumb.link = '[[link]]';
						sessionNotesBreadcrumb.linkText = 'notes';
						if ((<SessionInterface>this.currentElement).previousSession != null) {
							previousSessionBreadcrumb.nextBreadcrumb = sessionNotesBreadcrumb;
						} else {
							sessionNotesBreadcrumb.isInNewLine = true;
							sessionBreadcrumb.nextBreadcrumb = sessionNotesBreadcrumb;
						}

						if ((<SessionInterface>this.currentElement).nextSession != null){
							nextSessionBreadcrumb.link = (<SessionInterface>this.currentElement).nextSession?.link!;
							nextSessionBreadcrumb.linkText = 'next session >>';

							sessionNotesBreadcrumb.nextBreadcrumb = nextSessionBreadcrumb;
						}
					//}
					break;
				case DataType.Scene:
						adventureBreadcrumb.link = (<SceneInterface>this.currentElement).adventure.link;
						adventureBreadcrumb.title = DataType[DataType.Adventure];
						response.nextBreadcrumb = adventureBreadcrumb;

							sessionBreadcrumb = new ResponseBreadcrumb();
							sessionBreadcrumb.link = (<SceneInterface>this.currentElement).session.link;
							sessionBreadcrumb.title = DataType[DataType.Session];
							adventureBreadcrumb.nextBreadcrumb = sessionBreadcrumb;

							sceneBreadcrumb = new ResponseBreadcrumb();
							sceneBreadcrumb.link = this.currentElement.link;
							sceneBreadcrumb.title = DataType[DataType.Scene];
							sessionBreadcrumb.nextBreadcrumb = sceneBreadcrumb;

							const previousSceneBreadcrumb = new ResponseBreadcrumb();
							const nextSceneBreadcrumb = new ResponseBreadcrumb();
							if ((<SceneInterface>this.currentElement).previousScene != null) {
								previousSceneBreadcrumb.link = (<SceneInterface>this.currentElement).previousScene?.link!;
								previousSceneBreadcrumb.linkText = '<< prev scene';
								previousSceneBreadcrumb.isInNewLine = true;
								sceneBreadcrumb.nextBreadcrumb = previousSceneBreadcrumb;
							}

							if ((<SceneInterface>this.currentElement).nextScene != null){
								nextSceneBreadcrumb.link = (<SceneInterface>this.currentElement).nextScene?.link!;
								nextSceneBreadcrumb.linkText = 'next scene >>';

								if ((<SceneInterface>this.currentElement).previousScene != null) {
									previousSceneBreadcrumb.nextBreadcrumb = nextSceneBreadcrumb;
								} else {
									nextSceneBreadcrumb.isInNewLine = true;
									sceneBreadcrumb.nextBreadcrumb = nextSceneBreadcrumb;
								}
							}
					break;
				default:
					elementBreadcrumb.link = this.currentElement.link;
					elementBreadcrumb.title = DataType[this.currentElement.type];
					response.nextBreadcrumb = elementBreadcrumb;
					break;
			}
		}

		return response;
	}

	abstract generateData(
	): ResponseDataInterface;
}
