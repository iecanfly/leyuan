package controllers;

import models.Cong;

import org.codehaus.jackson.node.ObjectNode;

import play.data.Form;
import play.libs.Json;
import play.mvc.Result;

public class CongController extends BaseController {
	static Form<Cong> congForm = form(Cong.class);
	
	public static Result newCong() {
		Cong cong = congForm.bindFromRequest().get();
		
		try {
			Cong.create(cong);
			return ok("OK", "Cong saved successfully.");
		} catch (Exception e) {
			return badRequest("ERROR", "Could not create new cong : " + cong + e);
		}
	}
	
	public static Result find(String congName) {
		try {
			ObjectNode congNode = Json.newObject();
			Cong cong = Cong.find(congName);
			
			if(cong != null) {
				congNode.put("name", cong.name);
				congNode.put("centerCoord", cong.centerCoord);
				congNode.put("zoomLevel", cong.zoomLevel);
			} else {
				return ok("NOT_FOUND", "No such cong.");
			}
			
			return ok("OK", congNode);
		} catch (Exception e) {
			return badRequest("KO", e.getMessage());
		}
	}
	
}
