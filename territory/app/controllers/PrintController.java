package controllers;

import models.Block;
import play.mvc.Result;

public class PrintController extends BaseController {
	
	public static Result print(String cong, String blockString) {
		String blockName = blockString.split("-")[0];
		String blockNumber = blockString.split("-")[1];
		
		if(blockString.contains(",")) {
			String[] blockArray = blockString.split(",");
			return ok(views.html.printMultiple.render(Block.find(cong, blockArray)));
		}
		
		return ok(views.html.print.render(Block.find(cong, blockName, blockNumber)));
	}
	
	public static Result printRecordSheet(String cong, String blockString) {
		String blockName = blockString.split("-")[0];
		String blockNumber = blockString.split("-")[1];
		
		if(blockString.contains(",")) {
			String[] blockArray = blockString.split(",");
			return ok(views.html.printMultipleRecordSheet.render(Block.find(cong, blockArray)));
		}
		
		return ok(views.html.printRecordSheet.render(Block.find(cong, blockName, blockNumber)));
	}
	
	public static Result printOverall(String cong, String blockString) {
		String blockName = blockString.split("-")[0];
		String blockNumber = blockString.split("-")[1];
		
		if(blockString.contains(",")) {
			String[] blockArray = blockString.split(",");
			return ok(views.html.printMultipleOverall.render(Block.find(cong, blockArray)));
		}
		
		return ok(views.html.printOverall.render(Block.find(cong, blockName, blockNumber)));
	}


}