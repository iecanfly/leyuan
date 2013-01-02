package models;

import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.data.validation.Constraints.Required;
import play.db.ebean.Model;

@Entity
public class Record extends Model {
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
	public Date workDate;
	@Required
	public String initial;
	public Date returnDate;
	

	public static Finder<Long, Record> find = new Finder<Long, Record>(Long.class, Record.class);

	public static void create(Record record) {
		record.save();
	}

	public static void returnCard(Record record) {
		Record rec = find.where().ieq("cong", record.cong).ieq("block", record.block).ieq("number", record.number + "").orderBy("work_date desc").setMaxRows(1).findUnique();
		rec.returnDate = record.returnDate;
		rec.save();
	}

	public static void delete(String cong, String blockName, String blockNumber) {
		List<Record> recordList = find.where().ieq("cong", cong).ieq("block", blockName).ieq("number", blockNumber).findList();
		for (Record record : recordList) {
			record.delete();
		}
	}

	public static List<Record> findAll(String cong, String block, String number) {
		return find.where().ieq("cong", cong).ieq("block", block).ieq("number", number).orderBy("work_date desc").findList();
	}

	public static List<Record> findAll(String cong, String block, String number, String fromDate) {
		return find.where().ieq("cong", cong).ieq("block", block).ieq("number", number).ge("work_date", fromDate).orderBy("work_date desc").findList();
	}

	// pooo''[[ by etsuko

}
