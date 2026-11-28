# API 契约 R 样例

这些 JSON 来自后端 **standalone MockMvc 实际执行的回包**，使用既有受管 Jackson、MVC 校验器和 Mimir 异常处理器，AppService 为后端原有 stub。每个文件仅包含 `R` 信封，可直接 `import`；下表 HTTP status 属于测试响应元数据，不加入信封。

来源为 `midgard-backend-template` 提交 `af03830b7ff9feda9fb6232373528054bf7e4631`，依据[后端公共契约](../../../../midgard-backend-template/docs/design-docs/arch-api-contract.md)。源测试位于后端 `adapter/src/test/java/io/yggdrasil/labs/midgard/adapter/web/customer/`：

- `CustomerHttpContractTest`：下表全部 JSON 的来源；原有测试断言保持原样。
- `CustomerContractFixture`、`StubCustomerAppService`：原有 standalone 边界与受管序列化配置；仅临时副本的 `json(MvcResult)` 加入采集钩子。
- `CustomerResponseSerializationTest`：同时执行，核对六字段信封、数值版本/ID、嵌套分页与公共 trace 组件行为；不把该组件级验证视为完整应用装配证据。

2026-11-28 在 WSL / Temurin Java 17.0.21.1+2、本地缓存 Mimir 2.4.0 / Spring 6.1.21 / Jackson 2.17.3 下采集。在普通临时副本中重新编译 domain/app/adapter 的 25 个主源码及四个相关测试源码，复用现有 Surefire classpath 和本地依赖；JUnit Launcher 执行上述两套测试 **93 项通过、0 失败**，获得 76 个原始回包，再按下表选择 16 个样例。编译有两条原有 MapStruct 未映射属性警告（CustomerConvertor 的 id/status/version，CustomerWebConvertor 的 id）。未运行完整应用、数据库、容器或新增集成测试，未修改原后端。

规范化仅将顶层 `timestamp` 改为 `1700000000000`，保留整数类型。`traceId` 保留原始 `null`；原 standalone fixture 未注册 trace enhancer，不伪造 trace。其他字段、null、数组顺序、错误文本、业务码和数值均保留回包内容；用 UTF-8、两空格缩进和末尾换行输出。客户姓名与 `example.com` 邮箱均为原有合成测试数据。

| 文件                                               | HTTP status | code    | CustomerHttpContractTest 方法                                | 采集场景                                               |
| -------------------------------------------------- | ----------- | ------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| [success-create.json](success-create.json)         | 200         | `00000` | `create_returnsHttp200AndManagedEnvelope`                    | POST，姓名张三，示例邮箱，phone=null                   |
| [success-detail.json](success-detail.json)         | 200         | `00000` | `detail_preservesNumericIdAndExplicitNullPhone`              | GET /42，数值 ID、phone=null、version=0                |
| [success-update.json](success-update.json)         | 200         | `00000` | `update_partialRequestBindsPathIdAndLeavesMissingFieldsNull` | PUT /42，version=0、name=李四；响应 version=1          |
| [success-delete.json](success-delete.json)         | 200         | `00000` | `delete_returnsHttp200WithExplicitNullData`                  | DELETE /42；data=null                                  |
| [page.json](page.json)                             | 200         | `00000` | `list_serializesAppPageAndLongTotalWithoutTruncation`        | pageIndex=2、pageSize=10；stub totalCount=23           |
| [page-large-total.json](page-large-total.json)     | 200         | `00000` | `list_serializesAppPageAndLongTotalWithoutTruncation`        | 同上；stub totalCount=4294967296                       |
| [page-empty.json](page-empty.json)                 | 200         | `00000` | `list_emptyPageUsesArrayAndDefaultBindingIgnoresOldAliases`  | 旧 page/size 被忽略，默认第 1 页、大小 10、空数组      |
| [business-20001.json](business-20001.json)         | 200         | `20001` | `businessException_mapsToHttp200AndSafeDomainEnvelope`       | GET /999；stub 抛 DATA_NOT_FOUND                       |
| [business-21001.json](business-21001.json)         | 200         | `21001` | `businessException_mapsToHttp200AndSafeDomainEnvelope`       | POST；stub 抛 EMAIL_ALREADY_EXISTS                     |
| [business-21002.json](business-21002.json)         | 200         | `21002` | `businessException_mapsToHttp200AndSafeDomainEnvelope`       | PUT /42；stub 抛 VERSION_CONFLICT，仅映射证据          |
| [validation-field.json](validation-field.json)     | 400         | `00004` | `invalidField_returnsStructuredErrorWithoutCallingApp`       | POST email=secret-input；FIELD/email 的 Email、Pattern |
| [validation-object.json](validation-object.json)   | 400         | `00004` | `update_allMissingOrNullIsObjectError`                       | PUT /42，仅 version=0；OBJECT/$                        |
| [validation-version.json](validation-version.json) | 400         | `00004` | `update_rejectsMissingVersionWithoutCallingApp`              | PUT /42，phone=""，缺少 version；FIELD/version         |
| [protocol-404.json](protocol-404.json)             | 404         | `20001` | `missingRoute_returnsProtocol404InsteadOfBusinessHttp200`    | GET /api/missing-contract-route；未调用 AppService     |
| [system-500.json](system-500.json)                 | 500         | `10000` | `unknownFailure_returnsSafe500`                              | GET /42；stub 抛 IllegalStateException，隐藏底层消息   |
| [malformed-json.json](malformed-json.json)         | 400         | `00004` | `malformedJson_returnsSafe400WithoutCallingApp`              | POST 非完整 JSON；data=null，无原始请求内容            |

`21002` 仅证明异常到信封的映射；分页数据由 stub 提供。上述证据不验证 MySQL 并发、V2 迁移、Spring 自动装配、真实 HTTP 服务、浏览器/E2E、远端 CI 或发布后的消费者行为。

## 复现

从前端仓库根目录执行下列命令；需要相邻后端处于上述干净提交，且已有 `target/` 和本地依赖缓存。缺少缓存时停止，不自动安装或下载。脚本只建立 `/tmp/asgard-r-fixture-*` 普通副本、注入采集钩子、调用 `javac` 与 `java`，不会 Git 写入或覆盖当前 fixture。新采集结果输出到临时目录，最后逐字节比较本目录 JSON。

实际采集入口为 `python3 /tmp/asgard-r-fixture-capture.py`，选择与规范化入口为 `python3 /tmp/asgard-r-fixture-normalize.py`；本次原始回包、独立 metadata、`commands.json`、编译与 JUnit 日志保存在 `/tmp/asgard-r-fixture-sxo94qbf/`。临时路径不是持久依赖；下面合并保留等价的完整复现命令。`commands.json` 记录精确 javac/java 参数，包括全部 classpath 和源码路径。

```bash
python3 - <<'PY'
from pathlib import Path
import xml.etree.ElementTree as ET
import shutil, subprocess, tempfile, json, hashlib

source = Path('../midgard-backend-template').resolve()
assert subprocess.check_output(['git', '-C', str(source), 'rev-parse', 'HEAD'], text=True).strip() == 'af03830b7ff9feda9fb6232373528054bf7e4631'
assert not subprocess.check_output(['git', '-C', str(source), 'status', '--porcelain'], text=True).strip()
work = Path(tempfile.mkdtemp(prefix='asgard-r-fixture-'))
backend = work / 'backend'
shutil.copytree(source, backend, ignore=shutil.ignore_patterns('.git'))
raw = work / 'raw'
raw.mkdir()
classes = work / 'classes'
classes.mkdir()
report = backend / 'adapter/target/surefire-reports/TEST-io.yggdrasil.labs.midgard.adapter.web.customer.CustomerHttpContractTest.xml'
props = {p.attrib['name']: p.attrib['value'] for p in ET.parse(report).getroot().find('properties')}
classpath = props['java.class.path'].replace(str(source), str(backend))
missing = [p for p in classpath.split(':') if not Path(p).exists()]
if missing:
    raise RuntimeError(f'Missing cached classpath entries: {missing}')
(work / 'classpath.txt').write_text(classpath)
fixture = backend / 'adapter/src/test/java/io/yggdrasil/labs/midgard/adapter/web/customer/CustomerContractFixture.java'
needle = '        return mapper.readTree(result.getResponse().getContentAsString(StandardCharsets.UTF_8));'
patch = '''        String body = result.getResponse().getContentAsString(StandardCharsets.UTF_8);
        String scenario = StackWalker.getInstance().walk(frames -> frames
            .filter(frame -> frame.getClassName().endsWith("CustomerHttpContractTest"))
            .findFirst().orElseThrow().getMethodName());
        java.nio.file.Path output = java.nio.file.Path.of(System.getProperty("fixture.output"));
        String index = String.format("%03d", CAPTURE_SEQUENCE.incrementAndGet());
        java.nio.file.Files.writeString(output.resolve(index + ".json"), body);
        ObjectNode metadata = mapper.createObjectNode();
        metadata.put("sourceTest", "CustomerHttpContractTest." + scenario);
        metadata.put("httpStatus", result.getResponse().getStatus());
        metadata.put("requestMethod", result.getRequest().getMethod());
        metadata.put("requestPath", result.getRequest().getRequestURI());
        byte[] requestBytes = result.getRequest().getContentAsByteArray();
        metadata.put("requestBody", requestBytes == null ? "" : new String(requestBytes, StandardCharsets.UTF_8));
        java.nio.file.Files.writeString(output.resolve(index + ".meta.json"), metadata.toString());
        return mapper.readTree(body);'''
text = fixture.read_text()
assert text.count(needle) == 1
text = text.replace(needle, patch).replace('    final ObjectMapper mapper = managedMapper();',
    '    private static final java.util.concurrent.atomic.AtomicInteger CAPTURE_SEQUENCE = new java.util.concurrent.atomic.AtomicInteger();\n\n    final ObjectMapper mapper = managedMapper();')
fixture.write_text(text)
runner = work / 'FixtureCaptureJUnit.java'
runner.write_text('''package io.yggdrasil.labs.midgard.adapter.web.customer;
import java.io.PrintWriter;
import org.junit.platform.launcher.core.LauncherDiscoveryRequestBuilder;
import org.junit.platform.launcher.core.LauncherFactory;
import org.junit.platform.launcher.listeners.SummaryGeneratingListener;
import static org.junit.platform.engine.discovery.DiscoverySelectors.selectClass;
public class FixtureCaptureJUnit {
  public static void main(String[] args) {
    var request = LauncherDiscoveryRequestBuilder.request()
        .selectors(selectClass(CustomerHttpContractTest.class), selectClass(CustomerResponseSerializationTest.class))
        .build();
    var summary = new SummaryGeneratingListener();
    var launcher = LauncherFactory.create();
    launcher.registerTestExecutionListeners(summary);
    launcher.execute(request);
    summary.getSummary().printTo(new PrintWriter(System.out));
    summary.getSummary().printFailuresTo(new PrintWriter(System.out));
    if (summary.getSummary().getTestsFailedCount() != 0 || summary.getSummary().getTestsFoundCount() == 0) System.exit(1);
  }
}
''')
sources = []
for module in ('domain', 'app', 'adapter'):
    sources.extend(sorted((backend / module / 'src/main/java').rglob('*.java')))
for name in ('CustomerContractFixture', 'StubCustomerAppService', 'CustomerHttpContractTest', 'CustomerResponseSerializationTest'):
    sources.append(fixture.with_name(name + '.java'))
sources.append(runner)
compile_cmd = ['javac', '-parameters', '-encoding', 'UTF-8', '-cp', classpath, '-d', str(classes), '-s', str(work / 'generated')] + [str(p) for p in sources]
run_cmd = ['java', '-Dfixture.output=' + str(raw), '-cp', str(classes) + ':' + classpath, 'io.yggdrasil.labs.midgard.adapter.web.customer.FixtureCaptureJUnit']
(work / 'commands.json').write_text(json.dumps({'compile': compile_cmd, 'run': run_cmd}, indent=2))
with (work / 'compile.log').open('w') as log:
    result = subprocess.run(compile_cmd, stdout=log, stderr=subprocess.STDOUT)
if result.returncode:
    print((work / 'compile.log').read_text())
    raise SystemExit(result.returncode)
with (work / 'test.log').open('w') as log:
    result = subprocess.run(run_cmd, stdout=log, stderr=subprocess.STDOUT)
print('WORK_DIR=' + str(work))
print((work / 'compile.log').read_text())
print('\n'.join((work / 'test.log').read_text().splitlines()[-40:]))
print('Raw captured responses:', len(list(raw.glob('*.meta.json'))))
assert result.returncode == 0, "Contract tests failed; do not consume captured outputs"

# 仅将复放生成的样例写入此临时目录。
out = work / 'fixtures'
out.mkdir()
entries=[]
for p in sorted((work/'raw').glob('*.meta.json')):
    entries.append((p, json.loads(p.read_text()), json.loads(p.with_name(p.name.replace('.meta.json','.json')).read_text())))

def method(name, condition=lambda m,b: True):
    return lambda m,b: m['sourceTest'] == 'CustomerHttpContractTest.' + name and condition(m,b)

selectors = {
'success-create': method('create_returnsHttp200AndManagedEnvelope'),
'success-detail': method('detail_preservesNumericIdAndExplicitNullPhone'),
'success-update': method('update_partialRequestBindsPathIdAndLeavesMissingFieldsNull'),
'success-delete': method('delete_returnsHttp200WithExplicitNullData'),
'page': method('list_serializesAppPageAndLongTotalWithoutTruncation', lambda m,b: b['data']['totalCount']==23),
'page-large-total': method('list_serializesAppPageAndLongTotalWithoutTruncation', lambda m,b: b['data']['totalCount']==4294967296),
'page-empty': method('list_emptyPageUsesArrayAndDefaultBindingIgnoresOldAliases'),
'business-20001': method('businessException_mapsToHttp200AndSafeDomainEnvelope', lambda m,b: b['code']=='20001' and m['requestMethod']=='GET'),
'business-21001': method('businessException_mapsToHttp200AndSafeDomainEnvelope', lambda m,b: b['code']=='21001' and m['requestMethod']=='POST'),
'business-21002': method('businessException_mapsToHttp200AndSafeDomainEnvelope', lambda m,b: b['code']=='21002'),
'validation-field': method('invalidField_returnsStructuredErrorWithoutCallingApp', lambda m,b: m['requestMethod']=='POST' and json.loads(m['requestBody'])['email']=='secret-input'),
'validation-object': method('update_allMissingOrNullIsObjectError', lambda m,b: m['requestBody']=='{"version":0}'),
'validation-version': method('update_rejectsMissingVersionWithoutCallingApp'),
'protocol-404': method('missingRoute_returnsProtocol404InsteadOfBusinessHttp200'),
'system-500': method('unknownFailure_returnsSafe500', lambda m,b: m['requestPath']=='/api/customers/42'),
'malformed-json': method('malformedJson_returnsSafe400WithoutCallingApp', lambda m,b: m['requestMethod']=='POST'),
}
provenance=[]
for name, selector in selectors.items():
    chosen = [(p,m,b) for p,m,b in entries if selector(m,b)]
    assert chosen, name
    p,m,b=chosen[0]
    raw=p.with_name(p.name.replace('.meta.json','.json'))
    assert set(b)=={'code','message','data','timestamp','traceId','success'}, name
    assert isinstance(b['timestamp'],int) and b['timestamp']>0, name
    b['timestamp']=1700000000000
    path=out/(name+'.json')
    assert not path.exists(), f'Refusing to overwrite {path}'
    path.write_text(json.dumps(b,ensure_ascii=False,indent=2)+'\n')
    provenance.append({'file':path.name,**m,'raw':str(raw),'rawSha256':hashlib.sha256(raw.read_bytes()).hexdigest(),'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
(work/'selected.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2)+'\n')
print('\n'.join(f"{p['file']} HTTP {p['httpStatus']} {p['sourceTest']}" for p in provenance))

reference = Path('tests/fixtures/api-contract-r')
for entry in provenance:
    assert (out / entry['file']).read_bytes() == (reference / entry['file']).read_bytes(), entry['file']
print('All 16 replay fixtures match the current fixture JSON byte for byte.')
PY
```
