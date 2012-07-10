package models;

import javax.persistence.Entity;
import javax.persistence.Id;

import play.data.validation.Constraints.Required;
import play.db.ebean.Model;

@Entity
public class Cong extends Model {
	private static final long serialVersionUID = 1L;

	@Id
	public Long id;
	@Required
	public String name;
	@Required
	public String centerCoord;
	@Required
	public String zoomLevel;
	
	public static Finder<Long, Cong> find = new Finder<Long, Cong>(Long.class, Cong.class);
	
	public static void create(Cong cong) {
		cong.save();
	}
	
	public static Cong find(String cong) {
		return find.where().ieq("name", cong).findUnique();
	}
	
}
