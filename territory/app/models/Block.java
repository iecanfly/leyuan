package models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.data.validation.Constraints.Required;
import play.db.ebean.Model;

@Entity
public class Block extends Model {
	private static final long serialVersionUID = 1L;

	@Id
	public Long id;
	@Required
	public String cong;
	@Required
	public String block;
	@Required
	public Integer number;
	@Required
	public String coord;
	public String markerCoord;
	public String printCoord;
	public String printZoomLevel;
	

	public static Finder<Long, Block> find = new Finder<Long, Block>(Long.class, Block.class);

	public static List<Block> all() {
		return find.all();
	}
	
	public static List<Block> find(String cong) {
		return find.where().ieq("cong", cong).orderBy("block, number asc").findList();
	}
	
	public static void create(Block point) {
		point.save();
	}

	public static void delete(Long id) {
		find.ref(id).delete();
	}
	
	public static void delete(String cong, String blockName, String blockNumber) {
		find.where().ieq("cong", cong).ieq("block", blockName).ieq("number", blockNumber).findUnique().delete();
	}

	public static Block find(String cong, String blockName, String blockNumber) {
		return find.where().ieq("cong", cong).ieq("block", blockName).ieq("number", blockNumber).findUnique();
	}

	/**
	 * TODO : Study ebean and refactor this "horrible" query code
	 * 
	 * @param cong
	 * @param blockArray
	 * @return
	 */
	public static List<Block> find(String cong, String[] blockArray) {
		List<Block> blockList = new ArrayList<Block>();
		
		for(String block : blockArray) {
			String blockName = block.split("-")[0];
			String blockNumber = block.split("-")[1];
			blockList.add(find.where().ieq("cong", cong).ieq("block", blockName).ieq("number", blockNumber).findUnique());
		}
		
		return blockList;
	}
	
	@Override
	public String toString() {
		return block + "-" + number;
		//return ReflectionToStringBuilder.toString(this, ToStringStyle.);
	}

	public static List<Block> find(String cong, String block) {
		return find.where().ieq("cong", cong).ieq("block", block).orderBy("block, number asc").findList();
	}
}
