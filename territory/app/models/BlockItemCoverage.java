package models;

import java.util.List;

public class BlockItemCoverage  {
	public String cong;
	public String block;
	public String number;
	public List<Record> recordList;

	public BlockItemCoverage(String cong, String block, String number, List<Record> recordList) {
		this.cong = cong;
		this.block = block;
		this.number = number;
		this.recordList = recordList;
	}
	
	
}
