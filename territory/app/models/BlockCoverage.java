package models;

import java.util.ArrayList;
import java.util.List;

public class BlockCoverage  {
	public String cong;
	public String block;
	public List<BlockItemCoverage> blockItemCoverageList;
	
	public BlockCoverage(String cong, String block) {
		this.cong = cong;
		this.block = block;
		this.blockItemCoverageList = new ArrayList<BlockItemCoverage>(); 
	}

}
