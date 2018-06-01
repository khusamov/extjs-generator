export default class ClassNameValidError extends Error {
	constructor(parentClassName: string) {
		super(`Имя класса '${parentClassName}' не соответствует правилу именования классов.`);
	}
}