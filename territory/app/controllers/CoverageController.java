package controllers;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import models.Block;
import models.BlockCoverage;
import models.BlockItemCoverage;
import models.Coverage;
import models.Record;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.node.ArrayNode;
import org.codehaus.jackson.node.ObjectNode;

import play.data.Form;
import play.libs.Json;
import play.mvc.Result;

public class CoverageController extends BaseController {
	static Form<Record> recordForm = form(Record.class);

	public static Result findCoverage(String cong, String fromDate) {

		try {
			List<Block> blockList = Block.find(cong);
			ObjectMapper mapper = new ObjectMapper();
			ArrayNode data = mapper.createArrayNode();

			for (Block block : blockList) {
				List<Record> recordList = Record.findAll(cong, block.block,	block.number.toString());
				ArrayNode recordArray = mapper.createArrayNode();
				SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
				for (Record record : recordList) {
					recordArray.add(format.format(record.workDate));
				}

				ObjectNode blockNode = Json.newObject();
				blockNode.put("cong", block.cong);
				blockNode.put("block", block.block);
				blockNode.put("number", block.number);
				blockNode.put("record", recordArray);
				data.add(blockNode);
			}

			return ok("OK", data);
		} catch (Exception e) {
			return badRequest("KO", e.getMessage());
		}
	}

	public static Result viewBlockViewCoverage(String cong, String fromDate) {
		Coverage coverage = new Coverage(cong);
		coverage.blockCoverageList = getBlockCoverage(Block.find(cong), cong, fromDate);
		return ok(views.html.blockCoverage.render(cong, coverage));
	}
	
	public static Result viewChartViewCoverage(String cong, String fromDate) {
		Coverage coverage = new Coverage(cong);
		coverage.blockCoverageList = getBlockCoverage(Block.find(cong), cong, fromDate);
		return ok(views.html.chartCoverage.render(cong, coverage));
	}
	
	private static List<Record> getRecordList(String cong, String block, String number, String fromDate) {
		return Record.findAll(cong, block, number.toString(), fromDate);
	}
	
	private static List<BlockItemCoverage> getBlockItemCoverage(List<Block> blockList, String cong, String blockName, String fromDate) {
		List<BlockItemCoverage> blockItemCoverageList = new ArrayList<BlockItemCoverage>();
		
		for(Block block : blockList) {
			if(block.cong.equals(cong) && block.block.equals(blockName)) {
				List<Record> recordList = getRecordList(cong, blockName, block.number.toString(), fromDate);
				BlockItemCoverage blockItemCoverage = new BlockItemCoverage(cong, blockName, block.number.toString(), recordList);
				blockItemCoverageList.add(blockItemCoverage);
			}
		}
		
		return blockItemCoverageList;
	}
	
	private static List<BlockCoverage> getBlockCoverage(List<Block> blockList, String cong, String fromDate) {
		List<BlockCoverage> blockItemCoverageList = new ArrayList<BlockCoverage>();
		String tempBlockName = "";
		
		for(Block block : blockList) {
			if(!tempBlockName.equals(block.block)) {
				BlockCoverage blockCoverage = new BlockCoverage(cong, block.block);
				blockCoverage.blockItemCoverageList = getBlockItemCoverage(blockList, cong, block.block, fromDate);
				blockItemCoverageList.add(blockCoverage);
			}
			
			tempBlockName = block.block;
		}
		
		return blockItemCoverageList;
	}

}
