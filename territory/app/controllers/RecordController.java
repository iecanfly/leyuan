package controllers;

import java.text.SimpleDateFormat;
import java.util.List;

import models.Record;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;

import play.data.Form;
import play.libs.Json;
import play.mvc.Result;

public class RecordController extends BaseController {
	static Form<Record> recordForm = form(Record.class);

	public static Result newRecord() {
		Form<Record> filledForm = recordForm.bindFromRequest();
		Record record = filledForm.get();

		try {
			Record.create(record);
			return ok("OK", "Record saved successfully.");
		} catch (Exception e) {
			return badRequest("ERROR", "Could not save record : " + record);
		}
	}

	public static Result returnCard() {
		Form<Record> filledForm = recordForm.bindFromRequest();
		Record record = filledForm.get();

		try {
			Record.returnCard(record);
			return ok("OK", "Card return saved successfully.");
		} catch (Exception e) {
			return badRequest("ERROR", "Could not save card return info : " + e);
		}
	}

	public static Result findRecords(String cong, String block) {
		try {
			List<Record> recordList = Record.findAll(cong, block.split("-")[0], block.split("-")[1]); 
			ArrayNode data = new ObjectMapper().createArrayNode();
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
			
			for(Record record : recordList) {
				ObjectNode recordNode = Json.newObject();
				recordNode.put("cong", record.cong);
				recordNode.put("block", record.block);
				recordNode.put("number", record.number);
				recordNode.put("initial", record.initial);
				recordNode.put("workDate", format.format(record.workDate));
				recordNode.put("returnDate", record.returnDate == null ? "" : format.format(record.returnDate));
				data.add(recordNode);
			}
			
			return ok("OK", data);
		} catch (Exception e) {
			e.printStackTrace();
			return badRequest("KO", e.toString());
			
		}
		
	}
	
	public static Result findOverallBlockRecords(String cong, String block) {
		try {
			List<Record> recordList = null;// Record.findOverall(cong, block); 
			ArrayNode data = new ObjectMapper().createArrayNode();
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
			
			for(Record record : recordList) {
				ObjectNode recordNode = Json.newObject();
				recordNode.put("cong", record.cong);
				recordNode.put("block", record.block);
				recordNode.put("number", record.number);
				recordNode.put("initial", record.initial);
				recordNode.put("workDate", format.format(record.workDate));
				recordNode.put("returnDate", record.returnDate == null ? "" : format.format(record.returnDate));
				data.add(recordNode);
			}
			
			return ok("OK", data);
		} catch (Exception e) {
			e.printStackTrace();
			return badRequest("KO", e.toString());
		}
	}
}
