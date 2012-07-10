package controllers;

import java.util.List;

import models.Block;
import models.Cong;
import models.Record;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;

import play.data.Form;
import play.libs.Json;
import play.mvc.Result;

public class BlockController extends BaseController {
	static Form<Block> blockForm = form(Block.class);

	public static Result index(String cong) {
		if (Cong.find(cong) != null) {
			return ok(views.html.index.render(Block.find(cong), cong));
		} else {
			return ok(views.html.first.render(cong));
		}

	}

	public static Result newBlock() {
		Form<Block> filledForm = blockForm.bindFromRequest();
		Block blockToSave = filledForm.get();

		try {
			if (Block.find(blockToSave.cong, blockToSave.block, blockToSave.number.toString()) != null) {
				return ok("ALREADY_EXISTS", "The same block already exists : " + blockToSave);
			} else {
				Block.create(filledForm.get());
			}

			return ok("OK", "Block saved successfully.");
		} catch (Exception e) {
			return badRequest("ERROR", "Could not save block : " + filledForm);
		}

	}

	public static Result findAll(String cong) {
		try {
			List<Block> blockList = Block.find(cong);
			ObjectMapper mapper = new ObjectMapper();
			ArrayNode data = mapper.createArrayNode();

			for (Block block : blockList) {
				ObjectNode blockNode = Json.newObject();
				blockNode.put("cong", block.cong);
				blockNode.put("block", block.block);
				blockNode.put("number", block.number);
				blockNode.put("coord", block.coord);
				data.add(blockNode);
			}

			return ok("OK", data);
		} catch (Exception e) {
			return badRequest("KO", e.getMessage());
		}
	}

	public static Result find(String cong, String block) {
		try {
			List<Block> blockList = Block.find(cong, block);
			ObjectMapper mapper = new ObjectMapper();
			ArrayNode data = mapper.createArrayNode();

			for (Block b : blockList) {
				ObjectNode blockNode = Json.newObject();
				blockNode.put("cong", b.cong);
				blockNode.put("block", b.block);
				blockNode.put("number", b.number);
				blockNode.put("coord", b.coord);
				data.add(blockNode);
			}

			return ok("OK", data);
		} catch (Exception e) {
			return badRequest("KO", e.getMessage());
		}
	}

	public static Result deleteBlock(String cong, String block) {
		try {
			String blockName = block.split("-")[0];
			String blockNumber = block.split("-")[1];
			Block.delete(cong, blockName, blockNumber);
			Record.delete(cong, blockName, blockNumber);
			return ok("OK", cong + ":" + block + " deleted successfully.");
		} catch (Exception e) {
			return ok("KO", cong + ":" + block + " not deleted :(");
		}

	}

}