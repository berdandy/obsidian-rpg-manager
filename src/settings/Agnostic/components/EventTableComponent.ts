import {AbstractComponent} from "../../../abstracts/AbstractComponent";
import {ResponseElementInterface} from "../../../interfaces/response/ResponseElementInterface";
import {ResponseTable} from "../../../data/responses/ResponseTable";
import {ContentFactory} from "../../../factories/ContentFactory";
import {ContentType} from "../../../enums/ContentType";
import {RpgDataInterface} from "../../../interfaces/data/RpgDataInterface";
import {EventInterface} from "../../../interfaces/data/EventInterface";

export class EventTableComponent extends AbstractComponent {
	generateData(
		data: RpgDataInterface[],
		title:string|null,
	): ResponseElementInterface | null {
		if (data.length === 0){
			return null;
		}

		const response = new ResponseTable();

		response.addTitle(title ? title : 'Events');
		response.addHeaders([
			ContentFactory.create('', ContentType.String, true),
			ContentFactory.create('Name', ContentType.String),
			ContentFactory.create('Date', ContentType.String),
			ContentFactory.create('Synopsis', ContentType.String),
		]);
		data.forEach((event: EventInterface) => {
			response.addContent([
				ContentFactory.create(event.imageSrcElement, ContentType.Image, true),
				ContentFactory.create(event.link, ContentType.Link, true),
				ContentFactory.create(event.date?.toDateString(), ContentType.String),
				ContentFactory.create(event.additionalInformation ?? event.synopsis, ContentType.Markdown),
			])
		});

		return response;
	}
}
