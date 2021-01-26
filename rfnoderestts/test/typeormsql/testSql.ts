import { Column, createConnection, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Limit } from "../../lib/dataaccess/beans/query/Limit";
import { BaseCrudSQLTypeOrmDaoImpl } from "../../lib/dataaccess/typeorm/dao/impl/BaseCrudSQLTypeOrmDaoImpl";
import { BaseCrudSQLTypeOrmServiceImpl } from "../../lib/dataaccess/typeorm/service/impl/BaseCrudSQLTypeOrmServiceImpl";

@Entity("test")
class Test {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    code!: string;
}

class TestDaoImpl extends BaseCrudSQLTypeOrmDaoImpl<Test>{
    getTableNameBuildORM() {
        return "test";
    }

    async newInstace(mapParams: {}): Promise<Test> {
        return new Test();
    }
}

class TestServiceImpl extends BaseCrudSQLTypeOrmServiceImpl<Test, TestDaoImpl>{
    constructor() {
        super(new TestDaoImpl());
    }


}

(async () => {
    let connection = await createConnection({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "root",
        database: "test",
        entities: [
            Test
        ],
        synchronize: false,
        logging: true
    });

    const testService = new TestServiceImpl();

    const count = await testService.count({}, [], [], []);

    console.log("Count data: " + count);

    const list: Test[] = await testService.list({}, [], [], [], [], [], new Limit(1, 2));

    for (let test of list) {
        console.log("List data: " + test.code);
    }

    const testInsert = false;

    if (testInsert) {
        const dataInsert = await testService.newInstace({});
        dataInsert.code = "INSERT"
        const data = await testService.add({}, dataInsert);
        console.log("Data insert " + data.code);
    }

    const testUpdate = false;

    if (testUpdate) {
        const dataUpdate = await testService.newInstace({});
        dataUpdate.code = "INSERTU"
        dataUpdate.id = 4;
        const data = await testService.edit({}, dataUpdate);
        console.log("Data update " + data.code);
    }

    const testRead = true;

    if (testRead) {
        const dataRead = await testService.newInstace({});
        dataRead.code = "READ"
        dataRead.id = 4;
        const data = await testService.read({}, dataRead.id)
        console.log("Data read " + data!.code);
    }

    const testRemove = false;

    if (testRemove) {
        const dataRemove = await testService.newInstace({});
        dataRemove.code = "INSERTU"
        dataRemove.id = 4;
        const data = await testService.delete({}, dataRemove);
        console.log("Data remove " + data);
    }



})();