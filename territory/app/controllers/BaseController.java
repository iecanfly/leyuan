package controllers;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;

import play.libs.Json;
import play.mvc.Controller;

public class BaseController  extends Controller {
	
	private static ObjectNode statusMessageNode(String status, String msg) {
		ObjectNode result = Json.newObject();
		result.put("status", status);
		result.put("message", msg);
		return result;
	}
	
	private static ObjectNode statusDataNode(String status, JsonNode data) {
		ObjectNode result = Json.newObject();
		result.put("status", status);
		result.put("data", data);
		return result;
	}
	
	public static Status ok(String status, String msg) {
		return ok(statusMessageNode(status, msg));
	}
	
	public static Status ok(String status, JsonNode msg) {
		return ok(statusDataNode(status, msg));
	}
	
	public static Status badRequest(String status, String msg) {
		return badRequest(statusMessageNode(status, msg));
	}

}
