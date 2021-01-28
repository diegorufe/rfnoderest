import { Column, createConnection, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Field } from "../../lib/dataaccess/beans/query/Field";
import { Join } from "../../lib/dataaccess/beans/query/Join";
import { Limit } from "../../lib/dataaccess/beans/query/Limit";
import { EnumJoinTypes } from "../../lib/dataaccess/constants/query/EnumJoinTypes";
import { BaseCrudSQLTypeOrmDaoImpl } from "../../lib/dataaccess/typeorm/dao/impl/BaseCrudSQLTypeOrmDaoImpl";
import { BaseCrudSQLTypeOrmServiceImpl } from "../../lib/dataaccess/typeorm/service/impl/BaseCrudSQLTypeOrmServiceImpl";


@Entity("test")
class Test {

    @PrimaryGeneratedColumn()
    @PrimaryColumn()
    id!: number;

    @Column()
    code!: string;


}


@Entity("testfore")
class TestFore {

    @PrimaryGeneratedColumn()
    @PrimaryColumn()
    id!: number;

    @Column()
    descr!: string;

    @Column()
    amount!: number;

    @ManyToOne(() => Test, test => test.id)
    @JoinColumn({ name: 'testId', referencedColumnName: 'id' })
    test!: Test;

    @ManyToOne(() => Test, testBis => testBis.id)
    @JoinColumn({ name: 'testIdBis', referencedColumnName: 'id' })
    testBis!: Test;

}


class TestDaoImpl extends BaseCrudSQLTypeOrmDaoImpl<Test>{
    getTableNameBuildORM() {
        return "test";
    }

    async newInstace(mapParams: {}): Promise<Test> {
        return new Test();
    }
}

class TestForeDaoImpl extends BaseCrudSQLTypeOrmDaoImpl<TestFore>{
    getTableNameBuildORM() {
        return "testfore";
    }

    async newInstace(mapParams: {}): Promise<TestFore> {
        return new TestFore();
    }
}

class TestServiceImpl extends BaseCrudSQLTypeOrmServiceImpl<Test, TestDaoImpl>{
    constructor() {
        super(new TestDaoImpl());
    }


}

class TestForeServiceImpl extends BaseCrudSQLTypeOrmServiceImpl<TestFore, TestForeDaoImpl>{
    constructor() {
        super(new TestForeDaoImpl());
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
            Test, TestFore
        ],
        synchronize: false,
        logging: true
    });

    const testService = new TestServiceImpl();
    const testForeService = new TestForeServiceImpl();


    const count = await testService.count({}, [], [], []);

    console.log("Count data: " + count);

    const list: Test[] = (await testService.list({}, [], [], [], [], [], new Limit(1, 2))).data!;

    console.log(list);

    for (let test of list) {
        console.log("List data: " + test.code);
    }


    const listFore: TestFore[] = (await testForeService.list({}, [], [], [new Join("test", EnumJoinTypes.INNER_JOIN_FETCH)], [], [], new Limit(0, 2))).data!;

    for (let testFore of listFore) {
        console.log("List data fore: ");
        console.log(testFore);
        console.log(testFore.test!.id);
    }

    const listFore2: TestFore[] = (await testForeService.list({}, [new Field("id"), new Field("code", "test")], [], [new Join("test", EnumJoinTypes.INNER_JOIN)], [], [], new Limit(0, 2))).data!;

    for (let testFore of listFore2) {
        console.log("List data fore 2: ");
        console.log(testFore);
    }

    const findPk: TestFore | undefined = (await testForeService.findByPk({}, 1, [])).data;
    console.log("Amount " + (findPk!.amount / 2));

    const testInsert = false;

    if (testInsert) {
        const dataInsert = (await testService.loadNew({})).data;
        dataInsert!.code = "INSERT"
        const data = (await testService.add({}, dataInsert!)).data;
        console.log("Data insert " + data!.code);
    }

    const testUpdate = false;

    if (testUpdate) {
        const dataUpdate = (await testService.loadNew({})).data;
        dataUpdate!.code = "INSERTU"
        dataUpdate!.id = 4;
        const data = (await testService.edit({}, dataUpdate!)).data;
        console.log("Data update " + data!.code);
    }

    const testRead = false;

    if (testRead) {
        const dataRead = (await testService.loadNew({})).data;
        dataRead!.code = "READ"
        dataRead!.id = 4;
        const data = (await testService.read({}, dataRead!.id)).data
        console.log("Data read " + data!.code);
    }

    const testRemove = false;

    if (testRemove) {
        const dataRemove = (await testService.loadNew({})).data;
        dataRemove!.code = "INSERTU"
        dataRemove!.id = 4;
        const data = (await testService.delete({}, dataRemove!)).data;
        console.log("Data remove " + data);
    }



})();