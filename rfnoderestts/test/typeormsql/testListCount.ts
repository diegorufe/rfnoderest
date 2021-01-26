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

})();