package models;

import java.util.ArrayList;
import java.util.List;

public class Coverage  {
	public String cong;
	public List<BlockCoverage> blockCoverageList;
	
	public Coverage(String cong) {
		this.cong = cong;
		this.blockCoverageList = new ArrayList<BlockCoverage>();
	}
	
	
}
